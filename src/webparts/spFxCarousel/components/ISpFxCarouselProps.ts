import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISpFxCarouselProps {
  description: string;
  context: WebPartContext;
  listUrl: string;
  listName: string;
}
