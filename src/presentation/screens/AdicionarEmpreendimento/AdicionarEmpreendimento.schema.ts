import { z } from "zod";

export const empreendimentoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cep: z.string(),
  endereco: z.string(),
  proprietario: z.string(),
  tipo: z.enum(["Residencial", "Comercial", "Infraestrutura"], {
    required_error: "Selecione o tipo de empreendimento",
    invalid_type_error: "Selecione o tipo de empreendimento",
  }),
});

export type EmpreendimentoFormData = z.infer<typeof empreendimentoSchema>;
