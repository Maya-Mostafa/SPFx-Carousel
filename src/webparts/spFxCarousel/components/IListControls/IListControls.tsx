import * as React from 'react';
import styles from '../SpFxCarousel.module.scss';
import {IListControlsProps} from './IListControlsProps';
import {CommandBarButton, Toggle} from 'office-ui-fabric-react';


export default function IListControls (props: IListControlsProps){

    return(
        <div className={styles.listControls}>
            <CommandBarButton iconProps={{ iconName: 'CalculatorAddition' }} text="Add Item" onClick={props.addItemHandler} />
            <CommandBarButton iconProps={{ iconName: 'Documentation' }} text="View All" onClick={props.viewAllHandler} />
            <Toggle className={styles.controlsEditToggle} label="Edit Items" inlineLabel onChange={props.toggleEditControls} />
        </div>
    );
}