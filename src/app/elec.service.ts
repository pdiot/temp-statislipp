import { Injectable } from '@angular/core'; 
  
@Injectable({ 
  providedIn: 'root'
}) 
export class ElecService { 
  shell:any; 
  ipcRenderer: any;

  constructor() {  
    this.shell = {}; 
    this.ipcRenderer = {};
  } 
} 
