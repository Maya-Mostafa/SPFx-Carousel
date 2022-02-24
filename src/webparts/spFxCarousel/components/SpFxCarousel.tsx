import * as React from "react";
import styles from "./SpFxCarousel.module.scss";
import { ISpFxCarouselProps } from "./ISpFxCarouselProps";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function SpFxCarousel(props: ISpFxCarouselProps) {
	const customRenderThumb = (children) => {
		children = [
			"Peel Virtual Secondary School",
			"Black History Month",
			"2021-22 Parents Reaching Out (PRO) Grants",
			"Start with a Smile",
		];
		return children.map((item) => {
			return <span>{item}</span>;
		});
	};

	return (
		<Carousel
			centerMode
			centerSlidePercentage={80}
			infiniteLoop
			renderThumbs={customRenderThumb}
		>
			<div>
				<img
					src={require(`../../../Assets/Peel Virtual Secondary School.png`)}
				/>
				<p className='legend'>Legend 1</p>
			</div>
			<div>
				<img
					src={require(`../../../Assets/Black History Month MySite Spotlight.png`)}
				/>
				<p className='legend'>Legend 2</p>
			</div>
			<div>
				<img src={require(`../../../Assets/PRO_Grant_Banner.png`)} />
				<p className='legend'>Legend 3</p>
			</div>
			<div>
				<img
					src={require(`../../../Assets/Kindergarten Registration Online.png`)}
				/>
				<p className='legend'>Legend 3</p>
			</div>
		</Carousel>
	);
}
