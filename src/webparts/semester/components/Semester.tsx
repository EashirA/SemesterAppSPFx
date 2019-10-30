import * as React from 'react';
import styles from '../Styles/Semester.module.scss';
import { Pivot, PivotItem, PivotLinkSize, IDatePickerStrings, IDropdownOption } from 'office-ui-fabric-react';
import { IListItems, ISemesterProps, INewApp, ISemesterState } from '../Interfaces/ISemesterInterfaces';
import { sp } from '@pnp/sp';

import MyApplication from './MyApplication';
import HandleApplications from './HandleApplication';
import NewApplication from './NewApplication';

export default class Semester extends React.Component<ISemesterProps, ISemesterState> {
  private _dayPickerStrings: IDatePickerStrings;
  private _options: IDropdownOption[];

  constructor(props: ISemesterProps, state: ISemesterState) {
    super(props);

    this.state = {
      fetchedData: [],
      myData: [],
      selectedKey: '0',
    };

    this._dayPickerStrings = {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

      goToToday: 'Go to today',
      prevMonthAriaLabel: 'Go to previous month',
      nextMonthAriaLabel: 'Go to next month',
      prevYearAriaLabel: 'Go to previous year',
      nextYearAriaLabel: 'Go to next year'
    };

    this._options = [
      { key: 'Proceed', text: 'Proceed' },
      { key: 'Accepted', text: 'Accepted' },
      { key: 'Rejected', text: 'Rejected' }
    ];
  }

  public componentDidMount() {
    this.getAllData();
  }

  // 'HandlerName/Title'   , 'HandlerName'

  public getAllData = (): void => {
    sp.web.lists.getByTitle('SemesterList1').items
      .select('Title', 'StartDate', 'EndDate', 'Status', 'Admin', 'Author/Title', 'ID')
      .expand('Author')
      .orderBy('StartDate', true)
      .get()
      .then((result: IListItems[]) => {
        this.setState({
          fetchedData: result
        });
      })
  }

  public addNewData = (newData: INewApp): void => {
    //console.log(newData.HandlerName)
    sp.web.lists.getByTitle('SemesterList1').items
      .add(
        {
          Title: newData.Title,
          StartDate: newData.StartDate,
          EndDate: newData.EndDate,
          Admin: newData.Admin
          // HandlerName:{
          //   results: newData.HandlerName
          // } 
        })
      .then(() => this.getAllData());
    this.setState({ selectedKey: '1' });
  }

  public updateItem = (item: IListItems): void => {
    sp.web.lists.getByTitle('SemesterList1').items.getById(item.ID).update({
      Title: item.Title,
      StartDate: item.StartDate,
      EndDate: item.EndDate,
      Status: item.Status
    })
      .then(() => this.getAllData());
  }

  public deleteItem = (item: IListItems): void => {
    sp.web.lists.getByTitle("SemesterList1").items
      .getById(item.ID)
      .delete()
      .then(() => this.getAllData());
  }

  private _handlePivotItemClick = (item: PivotItem): void => { this.setState({ selectedKey: item.props.itemKey }) }

  private filterApplications = (myItems: IListItems[]) => {
    console.log(this.props.DisplayName);
    if (this.props.DisplayName === ('Md Eashir Arafat' || 'Stefan Svensson')) {
      return (
        <Pivot linkSize={PivotLinkSize.large} selectedKey={`${this.state.selectedKey}`} onLinkClick={this._handlePivotItemClick}>
          <PivotItem className={styles.label} itemIcon='HomeSolid' headerText='Home' itemKey="0">
            <br /><br />
            <h1 className={styles.h1}>Welcome <i>{this.props.DisplayName}</i>  to Admin area !</h1>
            <p className={styles.paragraph}>Here you can administrate semester applications!</p>
            {/* may be an image if have enough time */}
          </PivotItem>
          <PivotItem headerText="Handle Application" itemIcon='CheckboxCompositeReversed' itemKey="1">
            <HandleApplications items={myItems} decideSemester={this.updateItem} _options={this._options} />
          </PivotItem>
        </Pivot>
      );
    }
    else {
      return (
        <Pivot linkSize={PivotLinkSize.large} selectedKey={`${this.state.selectedKey}`} onLinkClick={this._handlePivotItemClick}>
          <PivotItem headerText='Home' itemKey="0" className={styles.label} itemIcon='HomeSolid'>
            <br /><br />
            <h1 className={styles.h1}>Hello <i>{this.props.DisplayName}</i>! </h1>
            <p className={styles.paragraph}> Here you can apply and edit your semester applications! </p>
          </PivotItem>
          <PivotItem itemIcon='ContactInfo' headerText="My Applications" itemKey="1">
            <MyApplication myItems={myItems} updateItem={this.updateItem} deleteItem={this.deleteItem} _dayPickerStrings={this._dayPickerStrings} />
          </PivotItem>
          <PivotItem headerText="New Application" itemIcon='EditNote' itemKey="2">
            <NewApplication myItems={myItems} addNewData={this.addNewData} context={this.props.context} _dayPickerStrings={this._dayPickerStrings} />
          </PivotItem>
        </Pivot>
      );
    }
  }
  //if (item.HandlerName.Title === this.props.DisplayName) return (item);
  // 
  public render(): React.ReactElement<ISemesterProps> {
    const myData = this.state.fetchedData.filter((item) => {
      if (item.Admin === this.props.DisplayName) return (item);
      else if (item.Author.Title === this.props.DisplayName) return (item);
    });
    const Applications = this.filterApplications(myData);
    return (
      <div className={styles.semester} >
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <fieldset style={{ minHeight: '700px', minWidth: '565px' }} >
                {Applications}
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
