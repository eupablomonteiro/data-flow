const fieldLabels: Record<string, string> = {
  date: "data da venda",
  product: "nome do produto",
  category: "categoria do produto",
  price: "preço",
  quantity: "quantidade",
  customer_country: "país do cliente",
};

const fieldArticles: Record<string, { artigo: string; flexao: string }> = {
  date: { artigo: "A", flexao: "obrigatória" },
  product: { artigo: "O", flexao: "obrigatório" },
  category: { artigo: "A", flexao: "obrigatória" },
  price: { artigo: "O", flexao: "obrigatório" },
  quantity: { artigo: "A", flexao: "obrigatória" },
  customer_country: { artigo: "O", flexao: "obrigatório" },
};

interface RawError {
  row: number;
  errors: string[];
}

interface NormalizedError {
  row: number;
  errors: string[];
}

type ErrorRule = (error: string) => string | null;

function createFieldRules(fieldName: string, label: string): ErrorRule[] {
  const { artigo, flexao } = fieldArticles[fieldName] ?? { artigo: "O", flexao: "obrigatório" };

  return [
    (error) => {
      if (error === "Required" || error === `${fieldName}: Required`) {
        return `${artigo} ${label} é ${flexao}`;
      }
      return null;
    },
    (error) => {
      if (error.includes("at least 1 character")) {
        return `${artigo} ${label} é ${flexao}`;
      }
      return null;
    },
    (error) => {
      if (error.includes("at most 255 character")) {
        return `${artigo} ${label} não pode ter mais de 255 caracteres`;
      }
      return null;
    },
    (error) => {
      if (error.includes("at most 100 character")) {
        return `${artigo} ${label} não pode ter mais de 100 caracteres`;
      }
      return null;
    },
  ];
}

const dateRules: ErrorRule[] = [
  createFieldRules("date", fieldLabels.date)[0],
  createFieldRules("date", fieldLabels.date)[1],
  (error) => {
    if (error.includes("YYYY-MM-DD")) {
      return `A ${fieldLabels.date} deve estar no formato AAAA-MM-DD (ex: 2024-01-15)`;
    }
    return null;
  },
];

const productRules: ErrorRule[] = createFieldRules("product", fieldLabels.product);

const categoryRules: ErrorRule[] = createFieldRules("category", fieldLabels.category);

const priceRules: ErrorRule[] = [
  createFieldRules("price", fieldLabels.price)[0],
  (error) => {
    const lower = error.toLowerCase();
    if (lower.includes("received nan") || lower.includes("expected number")) {
      return `O ${fieldLabels.price} deve ser um número válido`;
    }
    return null;
  },
  (error) => {
    if (error.toLowerCase().includes("greater than 0")) {
      return `O ${fieldLabels.price} deve ser maior que zero`;
    }
    return null;
  },
  (error) => {
    if (error.toLowerCase().includes("less than or equal to")) {
      return `O ${fieldLabels.price} é muito alto`;
    }
    return null;
  },
];

const quantityRules: ErrorRule[] = [
  createFieldRules("quantity", fieldLabels.quantity)[0],
  (error) => {
    const lower = error.toLowerCase();
    if (lower.includes("received nan") || lower.includes("expected number")) {
      return `A ${fieldLabels.quantity} deve ser um número válido`;
    }
    return null;
  },
  (error) => {
    if (error.toLowerCase().includes("greater than 0")) {
      return `A ${fieldLabels.quantity} deve ser maior que zero`;
    }
    return null;
  },
  (error) => {
    if (error.toLowerCase().includes("integer")) {
      return `A ${fieldLabels.quantity} deve ser um número inteiro`;
    }
    return null;
  },
  (error) => {
    if (error.toLowerCase().includes("less than or equal to")) {
      return `A ${fieldLabels.quantity} é muito alta`;
    }
    return null;
  },
];

const customerCountryRules: ErrorRule[] = createFieldRules(
  "customer_country",
  fieldLabels.customer_country,
);

const fieldRulesMap: Record<string, ErrorRule[]> = {
  date: dateRules,
  product: productRules,
  category: categoryRules,
  price: priceRules,
  quantity: quantityRules,
  customer_country: customerCountryRules,
};

function extractFieldName(error: string): string | null {
  const match = error.match(/^(\w+):/);
  if (match) return match[1];

  for (const field of Object.keys(fieldLabels)) {
    if (error.includes(field)) return field;
  }

  return null;
}

function normalizeSingleError(error: string): string {
  const fieldName = extractFieldName(error);

  if (fieldName && fieldRulesMap[fieldName]) {
    for (const rule of fieldRulesMap[fieldName]) {
      const friendly = rule(error);
      if (friendly) return friendly;
    }
  }

  for (const rules of Object.values(fieldRulesMap)) {
    for (const rule of rules) {
      const friendly = rule(error);
      if (friendly) return friendly;
    }
  }

  return error;
}

export function normalizeSaleErrors(errors: RawError[]): NormalizedError[] {
  return errors.map((entry) => ({
    row: entry.row,
    errors: entry.errors.map(normalizeSingleError),
  }));
}
