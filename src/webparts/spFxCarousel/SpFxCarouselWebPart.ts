import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SpFxCarouselWebPartStrings';
import SpFxCarousel from './components/SpFxCarousel';
import { ISpFxCarouselProps } from './components/ISpFxCarouselProps';

export interface ISpFxCarouselWebPartProps {
  description: string;
  listUrl: string;
  listName: string;
  width: string;
  background: string;
}

export default class SpFxCarouselWebPart extends BaseClientSideWebPart<ISpFxCarouselWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISpFxCarouselProps> = React.createElement(
      SpFxCarousel,
      {
        description: this.properties.description,
        context: this.context,
        listUrl: this.properties.listUrl,
        listName: this.properties.listName,
        width: this.properties.width,
        background: this.properties.background
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listUrl', {
                  label: 'Site URL',
                  value: this.properties.listUrl
                }),
                PropertyPaneTextField('listName', {
                  label: 'List Name',
                  value: this.properties.listName
                }),
                PropertyPaneDropdown('width', {
                  label: 'Width',
                  selectedKey : 'Full',
                  options: [
                    {key: 'Full', text: 'Full'},
                    {key: '95', text: '95%'},
                    {key: '90', text: '90%'},
                    {key: '85', text: '85%'},
                    {key: '80', text: '80%'},
                    {key: '75', text: '75%'},
                    {key: '70', text: '70%'},
                    {key: '65', text: '65%'},
                    {key: '60', text: '60%'}
                  ]
                }),
                PropertyPaneDropdown('background', {
                  label: 'Background Color',
                  selectedKey: 'White',
                  options: [
                    {key: 'White', text: 'White'},
                    {key: 'PeelBlue', text: 'Peel Blue'},
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
