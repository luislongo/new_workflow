import type { IArquivoDownloader } from "../domain/repositories/IArquivoDownloader";

export class BlobArquivoDownloader implements IArquivoDownloader {
  baixar(nomeArquivo: string, conteudo: string, mimeType: string): void {
    const blob = new Blob([conteudo], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    // Firefox só dispara o download com a âncora conectada ao DOM, e revogar a URL
    // de forma síncrona pode invalidar o blob antes de o browser terminar de lê-lo.
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
