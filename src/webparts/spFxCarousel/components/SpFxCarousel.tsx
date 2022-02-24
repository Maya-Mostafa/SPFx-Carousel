import * as React from "react";
import styles from "./SpFxCarousel.module.scss";
import { ISpFxCarouselProps } from "./ISpFxCarouselProps";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./carousel-override.scss";
import ReactPlayer from 'react-player';
import {Icon, initializeIcons} from 'office-ui-fabric-react';
import {getCarouselItems} from '../Services/Requests';


export default function SpFxCarousel(props: ISpFxCarouselProps) {
	
  initializeIcons();

  const [carouselItems, setCarouselItems] = React.useState([]);

  React.useEffect(()=>{
    getCarouselItems(props.context, '', '').then(r=> {console.log(r);setCarouselItems(r);});
  },[]);

  const customRenderThumb = (children) => {
		return children.map((item) => {
			return <span className="slideBtn" style={{backgroundColor: item.btnColor}}>{item.thumbTitle} {item.link && <a data-interception="off" target="_blank" title="Open Link" href={item.link}><Icon iconName="OpenInNewTab" /></a>}</span>;
		});
	};

  const YoutubeSlide = ({ url, isSelected }: { url: string; isSelected?: boolean }) => (
    <ReactPlayer width="100%" url={url} playing={isSelected} />
  );

	return (
		<Carousel
			centerMode
			centerSlidePercentage={80}
			infiniteLoop
      interval={5000}
      autoPlay
      showIndicators={false}
      showStatus={false}
			renderThumbs={() => customRenderThumb(carouselItems)}
		>
      {carouselItems.map(item => {
        return(
          <React.Fragment>
            {true && 
              <div>
                <img src={item.img} />
              </div>
            }
          </React.Fragment>
        )
      })}
			
		</Carousel>
	);
}




