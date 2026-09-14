import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormGroup,
  Radio,
  DoubleColumn,
  Button,
  H1,
  Description,
} from "@luislongo/ds-core";
import { useContainer } from "../../context/ContainerContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  empreendimentoSchema,
  type EmpreendimentoFormData,
} from "./AdicionarEmpreendimento.schema";

const TIPOS = ["Residencial", "Comercial", "Infraestrutura"] as const;

export function AdicionarEmpreendimento() {
  const { createEmpreendimento } = useContainer();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const size = isDesktop ? "desktop" : "mobile";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmpreendimentoFormData>({
    resolver: zodResolver(empreendimentoSchema),
  });

  async function onSubmit(data: EmpreendimentoFormData) {
    await createEmpreendimento.execute({
      nome: data.nome,
      email: data.email,
      tipo: data.tipo,
      cep: data.cep ?? "",
      endereco: data.endereco ?? "",
      proprietario: data.proprietario ?? "",
    });
    window.alert("Empreendimento cadastrado com sucesso!");
    reset();
  }

  function onCancel() {
    reset();
  }

  const textFields = (
    <div className="flex flex-col gap-[10px]">
      <FormGroup
        label="Nome do empreendimento"
        placeholder="Ex.: Residencial Vista Verde"
        error={errors.nome?.message}
        {...register("nome")}
      />
      <FormGroup
        label="Endereço de e-mail"
        placeholder="contato@exemplo.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormGroup
        label="CEP"
        placeholder="00000-000"
        {...register("cep")}
      />
      <FormGroup
        label="Endereço"
        placeholder="Rua, número, bairro"
        {...register("endereco")}
      />
      <FormGroup
        label="Proprietário"
        placeholder="Nome completo"
        {...register("proprietario")}
      />
    </div>
  );

  const radioGroup = (
    <FormGroup error={errors.tipo?.message}>
      <fieldset className="flex flex-col gap-[8px]">
        <legend className="text-sm text-neutral-600 mb-[4px]">
          Tipo de empreendimento
        </legend>
        {TIPOS.map((tipo) => (
          <label key={tipo} className="flex items-center gap-[8px] cursor-pointer">
            <Radio value={tipo} {...register("tipo")} />
            {tipo}
          </label>
        ))}
      </fieldset>
    </FormGroup>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-[10px]">
      <div className="flex flex-col gap-[4px]">
        <H1>Adicionar empreendimento vazio</H1>
        <Description>
          Preencha as informações necessárias para cadastrar o empreendimento
        </Description>
      </div>

      <DoubleColumn size={size} slotLeft={textFields} slotRight={radioGroup} />

      <div className="flex justify-end gap-[10px]">
        <Button variant="secondary" size="md" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" size="md" type="submit">
          Confirmar
        </Button>
      </div>
    </form>
  );
}
