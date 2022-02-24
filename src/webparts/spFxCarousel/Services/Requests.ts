import { WebPartContext } from "@microsoft/sp-webpart-base";
import {HttpClientResponse, HttpClient, IHttpClientOptions, MSGraphClient, SPHttpClient} from "@microsoft/sp-http";

export const getCarouselItems = async (context: WebPartContext, listName: string, listUrl: string) =>{
    const today = new Date();
    const restUrl = `https://pdsb1.sharepoint.com/sites/My-Site/_api/web/GetFolderByServerRelativeUrl('Spotlight')/Files?$select=Id,Title,Button_x0020_Title,ServerRelativeUrl,Colour,Link,Default,Order,Start,End,ListItemAllFields&$expand=ListItemAllFields`;
    const response = await context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then(r => r.json());

    const results = [];
    for (let item of response.value){
        if (new Date(item.ListItemAllFields.Start) < today && new Date(item.ListItemAllFields.End) > today){
            results.push({
                id: item.ListItemAllFields.ID,
                thumbTitle: item.Title || item.ServerRelativeUrl.replace(/.*\/(.+?)\.aspx/i, "$1"),
                img: item.ServerRelativeUrl,
                link: item.ListItemAllFields.Link,
                btnColor: item.ListItemAllFields.Colour.substring(item.ListItemAllFields.Colour.indexOf('#')),
                video: item.ListItemAllFields.URL ? item.ListItemAllFields.URL.Url : null,
                order: item.ListItemAllFields.Order || 0,
                startDate: item.ListItemAllFields.Start,
                expiryDate: item.ListItemAllFields.End
            })
        }
    }

    return results;
};
