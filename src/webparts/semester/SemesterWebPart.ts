import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SemesterWebPartStrings';
import Semester from './components/Semester';
import { ISemesterProps } from './Interfaces/ISemesterInterfaces';
import { setup as pnpSetup } from '@pnp/common';

export interface ISemesterWebPartProps {
  description: string;
}

export default class SemesterWebPart extends BaseClientSideWebPart<ISemesterWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISemesterProps> = React.createElement(
      Semester,
      {
        description: this.properties.description,
        DisplayName: this.context.pageContext.user.displayName,
        UserEmail: this.context.pageContext.user.email,
        context: this.context,
        itemKey: '0'
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    pnpSetup({
      spfxContext: this.context
    });
    return Promise.resolve();
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
