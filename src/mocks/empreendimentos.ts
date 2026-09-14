import { faker } from '@faker-js/faker/locale/pt_BR'
import type { Empreendimento } from './types'

faker.seed(42)

const empreendimentos: Empreendimento[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nome: faker.company.name(),
  email: faker.internet.email(),
  cep: faker.location.zipCode('#####-###'),
  endereco: faker.location.streetAddress(),
  proprietario: faker.person.fullName(),
  tipo: faker.helpers.arrayElement(['Residencial', 'Comercial', 'Infraestrutura'] as const),
}))

export async function fetchEmpreendimentos(): Promise<Empreendimento[]> {
  return empreendimentos
}
