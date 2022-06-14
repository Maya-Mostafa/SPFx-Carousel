import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IListControlsProps{
    context: WebPartContext;
    addItemHandler: any;
    viewAllHandler: any;
    toggleEditControls: any;
}