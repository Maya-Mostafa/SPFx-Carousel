import * as React from "react";
import styles from "./SpFxCarousel.module.scss";
import { ISpFxCarouselProps } from "./ISpFxCarouselProps";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./carousel-override.scss";
import ReactPlayer from 'react-player';
import {Icon, initializeIcons, DialogType, Dialog, DialogFooter, PrimaryButton, DefaultButton, CommandBarButton} from 'office-ui-fabric-react';
import {getCarouselItems, isUserManage, deleteItem} from '../Services/Requests';
import IListControls from './IListControls/IListControls';
import { IFrameDialog } from "@pnp/spfx-controls-react/lib/IFrameDialog";

export default function SpFxCarousel(props: ISpFxCarouselProps) {
	
  initializeIcons();

  const fetchItems = () =>{
    getCarouselItems(props.context, props.listName, props.listUrl).then(r=> {setCarouselItems(r);});
  };

  const [carouselItems, setCarouselItems] = React.useState([]);
  const [editControlsVisible, setEditControlsVisible] = React.useState(false);
  const [iFrame, setIFrame] = React.useState({url: '', visible: false});
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [itemIdState, setItemIdState] = React.useState(null);

  React.useEffect(()=>{
    fetchItems();
  },[]);

  const toggleEditControls = () => {
    setEditControlsVisible(!editControlsVisible);
  };

  // View all items
  const viewAllHandler = () => {
    window.open(`${props.listUrl}/${props.listName}/Forms/Allitems.aspx`, '_blank');
  };

  // Add item
  const addItemHandler = () => {
    setIFrame({url: `${props.listUrl}/_layouts/15/Upload.aspx?List=%7BE98AD0D0-2723-4EEB-BCA7-2D3AD9F7A042%7D&RootFolder=%2Fsites%2FMy-Site%2FSpotlight&ContentTypeId=0x0101009148F5A04DDD49CBA7127AADA5FB792B00AADE34325A8B49CDA8BB4DB53328F2140021BE7D7AC0C3BE4A8DEF89202A6B4A65&Source=https%3A%2F%2Fpdsb1.sharepoint.com%2Fsites%2FMy-Site%2FSpotlight%2Fforms%2Fallitems.aspx` , visible: true});
  };

  // IFrame fncs
  const onIFrameDismiss = (event) => {
    setIFrame({url:'', visible: false});
  };
  const onIFrameLoad = (iframe) => {
    const iframeUrl = iframe.contentWindow.location.href;
    if(iframeUrl.indexOf('AllItems.aspx') !== -1 ){
      onIFrameDismiss(null); 
      fetchItems();
    }
  };

  // Edit
  const onEditIconClick = (itemId: string) => {
    setIFrame({url: `${props.listUrl}/Lists/${props.listName}/EditForm.aspx?ID=${itemId}` , visible: true});
  };

  // Delete item
  const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 450 } },
  };
  const dialogContentProps = {
      type: DialogType.largeHeader,
      title: 'Delete Item',
      subText: 'Are you sure you want to delete this item?',
  };
  const onDeleteIconClick = (itemId: string) => {
    setDialogVisible(true);
    setItemIdState(itemId);
  };
  const onDeleteConfirmHandler = async () => {
    console.log("itemId", itemIdState);
    const deleteResponse = await deleteItem(props.context, props.listUrl, props.listName, itemIdState);
    if (deleteResponse.ok){
      setDialogVisible(false);
      fetchItems();
    }
  };

  const customRenderThumb = (children) => {
		return children.map((item) => {
			return (
        <span className="slideBtn" style={{backgroundColor: item.btnColor, borderBottomColor: item.btnColor}}>
          {item.thumbTitle} 
          {item.link && 
            <a data-interception="off" target="_blank" title="Open Link" href={item.link}><Icon iconName="OpenInNewTab" /></a>
          }
          {editControlsVisible &&
            <span className={styles.itemEditControls}>
                <CommandBarButton iconProps={{ iconName: 'Edit' }} title="Edit" onClick={() => onEditIconClick(item.id)} />
                <CommandBarButton iconProps={{ iconName: 'Delete' }} title="Delete" onClick={() => onDeleteIconClick(item.id)} />
            </span>
          }
        </span>
      );
		});
	};

  const YoutubeSlide = ({ url, isSelected }: { url: string; isSelected?: boolean }) => (
    <ReactPlayer controls width="100%" height="100%" url={url} playing={isSelected} />
  );

  const slide = (item) =>{
    return(
      <React.Fragment>
        {!item.video && 
          <div><img src={item.img} /></div>
        }
        {item.videoType === "other" && 
          <div className="slide-video">
            <video controls width="100%" height="100%">
              <source src={item.video} type="video/mp4"/>
            </video>
          </div>
        }
        {item.videoType === "youTube" && 
          <div className="slide-video"><YoutubeSlide key="youtube-1" url={item.video} /></div>
        }
      </React.Fragment>
    );
  };


	return (
		<div className={styles.spFxCarousel}>
		  <Carousel
        centerMode
        centerSlidePercentage={70}
        // infiniteLoop
        emulateTouch
        useKeyboardArrows
        // interval={5000}
        // autoPlay
        // stopOnHover
        showIndicators={false}
        showStatus={false}
        renderThumbs={() => customRenderThumb(carouselItems)}
  		>
        {carouselItems && carouselItems.map(item => slide(item))}
  		</Carousel>
      {isUserManage &&
        <IListControls
          toggleEditControls={toggleEditControls}
          viewAllHandler={viewAllHandler}
          addItemHandler={addItemHandler}
          context={props.context}
        />
      }
      <IFrameDialog
				url={iFrame.url}
				width={"70%"}
				height={"90%"}
				hidden={!iFrame.visible}
				iframeOnLoad={(iframe) => onIFrameLoad(iframe)}
				onDismiss={(event) => onIFrameDismiss(event)}
				allowFullScreen={true}
				dialogContentProps={{
					type: DialogType.close,
					showCloseButton: true,
				}}
			/>
			<Dialog
				hidden={!dialogVisible}
				onDismiss={() => setDialogVisible(false)}
				dialogContentProps={dialogContentProps}
				modalProps={modelProps}
			>
				<DialogFooter>
					<PrimaryButton
						onClick={onDeleteConfirmHandler}
						text='Yes'
					/>
					<DefaultButton
						onClick={() => setDialogVisible(false)}
						text='No'
					/>
				</DialogFooter>
			</Dialog>
		</div>
	);
}




