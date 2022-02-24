import * as React from "react";
import styles from "./SpFxCarousel.module.scss";
import { ISpFxCarouselProps } from "./ISpFxCarouselProps";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./carousel-override.scss";
import ReactPlayer from 'react-player';
import {Icon, initializeIcons} from 'office-ui-fabric-react';

export default function SpFxCarousel(props: ISpFxCarouselProps) {
	
  initializeIcons();

  const customRenderThumb = (children) => {
		children = [
			{
				thumbTitle: "Peel Virtual Secondary School",
				btnColor: "#2DA9D7",
				articleLink:
					"https://pdsb1.sharepoint.com/sites/AllStaffUpdates/SitePages/PDSB-announces-first-virtual-learning-environment-for-secondary-students,-launching-in-Sept.-2022.aspx",
			},
			{
				thumbTitle: "Black History Month",
				btnColor: "#B17DC6",
				articleLink: "",
			},
			{
				thumbTitle: "2021-22 Parents Reaching Out (PRO) Grants",
				btnColor: "#44AB97",
				articleLink: "",
			},
			{
				thumbTitle: "ITSM Polices & Procedures",
				btnColor: "#2DA9D7",
				articleLink: "",
			},
			{
				thumbTitle: "Start with a Smile",
				btnColor: "#2DA9D7",
				articleLink: "",
			},
			{
				thumbTitle: "Welcome to Mississauga SS",
				btnColor: "#E0B552",
				articleLink: "",
			},
		];
		return children.map((item) => {
			return <span className="slideBtn" style={{backgroundColor: item.btnColor}}>{item.thumbTitle} {item.articleLink && <a data-interception="off" target="_blank" title="Open Link" href={item.articleLink}><Icon iconName="OpenInNewTab" /></a>}</span>;
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
			renderThumbs={customRenderThumb}
		>
			<div>
				<img
					src={require(`../../../Assets/Peel Virtual Secondary School.png`)}
				/>
				{/* <p className='legend'>Legend 1</p> */}
        <a className='legend' data-interception="off" target="_blank" href="https://pdsb1.sharepoint.com/sites/AllStaffUpdates/SitePages/PDSB-announces-first-virtual-learning-environment-for-secondary-students,-launching-in-Sept.-2022.aspx">PDSB announces first virtual learning environment for secondary students, launching in Sept. 2022</a>
			</div>
			<div>
				<img
					src={require(`../../../Assets/Black History Month MySite Spotlight.png`)}
				/>
				{/* <p className='legend'>Legend 2</p> */}
			</div>
			<div>
				<img src={require(`../../../Assets/PRO_Grant_Banner.png`)} />
				{/* <p className='legend'>Legend 3</p> */}
			</div>
      <div>
        <video controls height="400">
          <source src="https://pdsb1.sharepoint.com/sites/LTSS/Shared%20Documents/General/IT%20Service%20Management%20%28ITSM%29/Service%20Manager%20%2D%20Training%20Resources/ITSM%20Policies%20and%20Procedures.mp4" type="video/mp4"/>
        </video>
      </div>
			<div>
				<img
					src={require(`../../../Assets/Kindergarten Registration Online.png`)}
				/>
				{/* <p className='legend'>Legend 3</p> */}
			</div>
      <div>
        <YoutubeSlide key="youtube-1" url="https://www.youtube.com/watch?v=VmxQaV9rH-0" />
      </div>
		</Carousel>
	);
}
