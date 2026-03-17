export class UploadPresenter {
  static toHTTP(upload: any) {
    return {
      id: upload.id,
      filename: upload.filename,
      status: upload.status,
      processedAt: upload.processedAt,
      createdAt: upload.createdAt,
    };
  }

  static toHTTPList(uploads: any[]) {
    return uploads.map(this.toHTTP);
  }
}
