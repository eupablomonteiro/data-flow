"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadErrorDTO } from "@dataflow/types";
import {
  AlertTriangle,
  FileX,
  Info,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UploadErrorsModalProps {
  open: boolean;
  onClose: () => void;
  errors: UploadErrorDTO[];
  totalErrors: number;
  filename: string;
}

const ITEMS_PER_PAGE = 10;

function getErrorType(errors: string[]): "date" | "number" | "empty" | "other" {
  const text = errors.join(" ").toLowerCase();
  if (text.includes("data") || text.includes("aaaa-mm-dd")) return "date";
  if (text.includes("número") || text.includes("maior que zero")) return "number";
  if (text.includes("obrigatório")) return "empty";
  return "other";
}

export function UploadErrorsModal({
  open,
  onClose,
  errors,
  totalErrors,
  filename,
}: UploadErrorsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(errors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentErrors = errors.slice(startIndex, endIndex);

  const dateErrors = errors.filter((e) => getErrorType(e.errors) === "date");
  const numberErrors = errors.filter(
    (e) => getErrorType(e.errors) === "number",
  );
  const emptyErrors = errors.filter((e) => getErrorType(e.errors) === "empty");

  const handleClose = () => {
    setCurrentPage(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] p-0 gap-0 flex flex-col ">
        <DialogHeader className="p-4 pb-3 border-b border-df-surface/20 bg-df-bg-secondary rounded-t-xl shrink-0">
          <DialogTitle className="flex items-center gap-3 text-base pr-8">
            <div className="w-8 h-8 rounded-full bg-df-warning/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-df-warning" />
            </div>
            <div className="min-w-0">
              <span className="text-df-white block">Erros de Validação</span>
              <span className="text-xs text-df-muted font-normal truncate block max-w-[180px] sm:max-w-xs">
                {filename}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="px-4 py-3 bg-df-surface/10 border-b border-df-surface/10 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-df-text text-sm font-medium">Resumo</span>
              <Badge
                variant="outline"
                className="bg-df-warning/10 text-df-warning border-df-warning/30 text-xs self-start sm:self-center w-fit"
              >
                {totalErrors}{" "}
                {totalErrors === 1 ? "linha com erro" : "linhas com erro"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dateErrors.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-df-info/10 text-df-info border border-df-info/20">
                  <Info className="w-3 h-3" />
                  {dateErrors.length} data
                </span>
              )}
              {numberErrors.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-df-error/10 text-df-error border border-df-error/20">
                  <XCircle className="w-3 h-3" />
                  {numberErrors.length} número
                </span>
              )}
              {emptyErrors.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-df-warning/10 text-df-warning border border-df-warning/20">
                  <FileX className="w-3 h-3" />
                  {emptyErrors.length} vazio
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto p-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-df-surface/10 hover:bg-df-surface/10 border-df-surface/20">
                  <TableHead className="w-16 text-df-muted font-medium text-xs sticky left-0 bg-df-bg-secondary z-10">
                    Linha
                  </TableHead>
                  <TableHead className="text-df-muted font-medium text-xs">
                    Problema(s)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentErrors.map((error) => {
                  const errorType = getErrorType(error.errors);
                  const borderColor =
                    errorType === "date"
                      ? "border-l-df-info"
                      : errorType === "number"
                        ? "border-l-df-error"
                        : errorType === "empty"
                          ? "border-l-df-warning"
                          : "border-l-df-muted";

                  return (
                    <TableRow
                      key={error.row}
                      className={`border-l-2 ${borderColor} hover:bg-df-surface/5`}
                    >
                      <TableCell className="font-mono text-df-text font-medium text-xs py-2 px-3 w-16 sticky left-0 bg-df-bg-secondary">
                        {error.row}
                      </TableCell>
                      <TableCell className="text-xs py-2 px-3">
                        <div className="flex flex-col gap-0.5">
                          {error.errors.map((err, i) => (
                            <span
                              key={i}
                              className="text-df-text/90 leading-tight"
                            >
                              • {err}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-df-surface/20 bg-df-surface/5 shrink-0">
              <span className="text-xs text-df-muted">
                {startIndex + 1}-{Math.min(endIndex, errors.length)} de{" "}
                {errors.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7 border-df-surface/40 hover:bg-df-surface/20"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <span className="text-xs text-df-muted px-2 min-w-[3rem] text-center">
                  {currentPage}/{totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-7 w-7 border-df-surface/40 hover:bg-df-surface/20"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-df-surface/20 bg-df-surface/5 rounded-b-xl shrink-0">
          <p className="text-df-muted text-xs text-center leading-relaxed">
            💡 <strong>Dica:</strong> Formato esperado: data (AAAA-MM-DD), produto, categoria, preço (número positivo), quantidade (número inteiro), país.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
