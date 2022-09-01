import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";
import { SPPermission } from "@microsoft/sp-page-context";

export const getCarouselItems = async (context: WebPartContext, listName: string, listUrl: string) =>{
    const today = new Date();
    // const restUrl = `${listUrl}/_api/web/GetFolderByServerRelativeUrl('${listName}')/Files?$select=Id,Title,Button_x0020_Title,ServerRelativeUrl,Colour,Link,Default,Order,Start,End,ListItemAllFields&$expand=ListItemAllFields`;
    const restUrl = `${listUrl}/_api/web/Lists/GetByTitle('${listName}')/items?$select=ID,Title,Img,link,Colour,URL,StartDate,End,Order&$orderby=Order`;
    const response = await context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then(r => r.json());

    // const sortedResults = response.value.sort((a,b) => a.ListItemAllFields.Order - b.ListItemAllFields.Order);
    const results = [];
    // console.log("response", response);
    for (let item of response.value){
        if (new Date(item.StartDate) < today && new Date(item.End) > today){
            results.push({
                id: item.ID,
                thumbTitle: item.Title,
                img: item.Img ? JSON.parse(item.Img).serverRelativeUrl : '',
                link: item.link ? item.link.Url : "",
                btnColor: item.Colour.substring(item.Colour.indexOf('#')),
                video: item.URL ? item.URL.Url : null,
                videoType: item.URL ? (item.URL.Url.indexOf("youtube") !== -1 ? "youTube" : "other") : null,
                order: item.Order || 0,
                startDate: item.StartDate,
                expiryDate: item.End
            });
        } 
    }

    return results;
};

export const deleteItem = async (context: WebPartContext ,listUrl: string, listTitle: string, itemId: any) =>{
    const restUrl = `${listUrl}/_api/web/lists/getByTitle('${listTitle}')/items(${itemId})/recycle`;
    let spOptions: ISPHttpClientOptions = {
        headers:{
            Accept: "application/json;odata=nometadata", 
            "Content-Type": "application/json;odata=nometadata",
            "odata-version": "",
            "IF-MATCH": "*",
        },
    };

    const _data = await context.spHttpClient.post(restUrl, SPHttpClient.configurations.v1, spOptions);
    if (_data.ok){
        console.log('Item is deleted! Please check Recycle Bin to restore it.');
        return _data;
    }
};

export const isUserManage = (context: WebPartContext) : boolean =>{
    const userPermissions = context.pageContext.web.permissions,
        permission = new SPPermission (userPermissions.value);
    
    return permission.hasPermission(SPPermission.manageWeb);
};