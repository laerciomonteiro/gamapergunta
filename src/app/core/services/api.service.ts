import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  // DEFINIÇÃO DE MÉTODOS HTTP

  // Consultar
  public get(endpoint: string, headers?): Observable<any> {
    return this.httpClient.get(endpoint, headers);
  }

  // Cadastrar/Salvar/Enviar
  public post(endpoint: string, body, headers?): Observable<any> {
    return this.httpClient.post(endpoint, body, headers);
  }

  // Alterar/Atualizar
  public put(endpoint: string, body): Observable<any> {
    return this.httpClient.put(endpoint, body);
  }

  // Deletar
  public delete(endpoint: string): Observable<any> {
    return this.httpClient.delete(endpoint);
  }
}
