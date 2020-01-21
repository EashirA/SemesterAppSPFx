import { DayOfWeek, IColumn } from "office-ui-fabric-react";

//WebPart
export interface ISemesterState {
  fetchedData: IListItems[];
  myData: IListItems[];
  selectedKey: string;
}

export interface ISemesterProps {
  description: string;
  DisplayName: string;
  UserEmail: string;
  itemKey: string;
  context: any;
}

// New Application
export interface INewApplicationState {
  value: INewApp;
  firstDayOfWeek?: DayOfWeek;
  btnSave: boolean;
  hideDialog: boolean;
}

export interface INewApplicationProps {
  myItems: IListItems[];
  addNewData:(item: INewApp) => void;
  context: any;
  _dayPickerStrings: any;
}

//Edit Application
export interface IMyApplicationsProps {
  myItems: IListItems[];
  updateItem: any;     
  deleteItem: any;
  _dayPickerStrings: any;
}

export interface IMyApplicationState {
  item: IListItems;
  allItems: IListItems[];
  items: IListItems[];
  columns: IColumn[];
  showModal: boolean;
  firstDayOfWeek?: DayOfWeek;
  hideDialog: boolean;
}

// Handle Applications
export interface IHandleApplicationsProps {
  items: IListItems[];
  decideSemester: any; // (item: IListItems) => void
  _options: any;

}

export interface IHandleApplicationsState {
  item: IListItems;
  items: IListItems[];
  columns: IColumn[];
  showModal: boolean;
}

export interface IOptions {
  key: string;
  text: string;
}

//Lists
export interface IListItems {
  ID: number;
  Title: string;
  StartDate: Date;
  EndDate: Date;
  Status: string;
  //HandlerName:any;
  Admin:string;
  Author: {
    Title: string;
  };
}

export interface INewApp {
  Title: string;
  StartDate: Date;
  EndDate: Date;
  //HandlerName :any;
  Admin:string;
}

export interface IDateNow {
  StartDate: Date;
  EndDate: Date;
}



