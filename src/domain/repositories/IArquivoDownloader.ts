export interface IArquivoDownloader {
  baixar(nomeArquivo: string, conteudo: string, mimeType: string): void;
}
