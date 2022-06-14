import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SpFxCarouselWebPartStrings';
import SpFxCarousel from './components/SpFxCarousel';
import { ISpFxCarouselProps } from './components/ISpFxCarouselProps';

export interface ISpFxCarouselWebPartProps {
  description: string;
  listUrl: string;
  listName: string;
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
