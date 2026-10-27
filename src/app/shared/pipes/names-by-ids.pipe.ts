import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'namesByIds'})
export class NamesByIdsPipe implements PipeTransform {
  transform<T extends {id: number}, K extends keyof T>(ids: number[], items: T[], key: K): T[K][] {
    return ids
      .map(id => items.find(item => item.id === id)?.[key])
      .filter((value): value is T[K] => value !== undefined);
  }
}
