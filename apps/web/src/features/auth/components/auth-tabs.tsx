"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="w-full max-w-[450px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl p-6 sm:p-8 glow-accent"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-df-white tracking-tight">
            {activeTab === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h2>
          <p className="text-df-muted text-sm mt-1.5">
            {activeTab === "login"
              ? "Insira seu e-mail para acessar sua conta"
              : "Comece sua jornada conosco hoje"}
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="login"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-df-bg-secondary/80 rounded-xl p-1 h-11">
            <TabsTrigger
              value="login"
              className={`rounded-lg h-full text-sm font-medium transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-df-accent text-white shadow-lg shadow-df-accent/25"
                  : "text-df-muted hover:text-df-text"
              }`}
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className={`rounded-lg h-full text-sm font-medium transition-all cursor-pointer ${
                activeTab === "register"
                  ? "bg-df-accent text-white shadow-lg shadow-df-accent/25"
                  : "text-df-muted hover:text-df-text"
              }`}
            >
              Cadastro
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "login" ? 15 : -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <TabsContent value="login" className="mt-0">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register" className="mt-0">
                <RegisterForm />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
}
