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

  const [carouselItems, setCarouselItems] = React.useState(['','']);
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
    window.open(`${props.listUrl}/lists/${props.listName}/Allitems.aspx`, '_blank');
  };

  // Add item
  const addItemHandler = () => {
    setIFrame({url: `${props.listUrl}/Lists/${props.listName}/NewForm.aspx` , visible: true});
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
          <a target="_blank" data-interception="off" className="slide-img" href={item.link}><img src={item.img} /></a>
        }
        {item.videoType === "other" && 
          <a target="_blank" data-interception="off" href={item.link} className="slide-video">
            <video controls width="100%" height="100%">
              <source src={item.video} type="video/mp4"/>
            </video>
          </a>
        }
        {item.videoType === "youTube" && 
          <a target="_blank" data-interception="off" href={item.link} className="slide-video"><YoutubeSlide key="youtube-1" url={item.video} /></a>
        }
      </React.Fragment>
    );
  };


	return (
		<div className={styles.spFxCarousel}>
		  <div className={`width${props.width} background${props.background}`}>
		    <Carousel
          // centerMode
          // centerSlidePercentage={100}
          infiniteLoop
          emulateTouch
          useKeyboardArrows
          swipeable
          transitionTime={500}
          interval={3000}
          autoPlay
          stopOnHover
          selectedItem={0}
          showIndicators={false}
          showStatus={false}
          autoFocus={false}
          renderThumbs={() => customRenderThumb(carouselItems)}
    		>
          {carouselItems && carouselItems.map(item => slide(item))}
    		</Carousel>
		  </div>
      {isUserManage(props.context) &&
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




