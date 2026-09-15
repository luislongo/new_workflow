import type { IArquivoDownloader } from "../domain/repositories/IArquivoDownloader";

export class BlobArquivoDownloader implements IArquivoDownloader {
  baixar(nomeArquivo: string, conteudo: string, mimeType: string): void {
    const blob = new Blob([conteudo], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(url);
  }
}
