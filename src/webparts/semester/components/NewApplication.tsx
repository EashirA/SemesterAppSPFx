import * as React from 'react';
import styles from '../Styles/Semester.module.scss';
import { INewApp, IDateNow, INewApplicationProps, INewApplicationState } from '../Interfaces/ISemesterInterfaces';
import { TextField, DatePicker, DayOfWeek, DialogFooter, Dialog, DialogType, getId, PrimaryButton } from 'office-ui-fabric-react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

export default class NewApplication extends React.Component<INewApplicationProps, INewApplicationState> {

  private _allExistingDates: IDateNow[];
  private _newItem: INewApp = { Title: '', StartDate: null, EndDate: null, Admin: '' }; // Look Here  HandlerId: 6
  private _dialogTitle: string;
  private _dialogText: string;
  private _labelId: string = getId('dialogLabel');
  private _subTextId: string = getId('subTextLabel');

  constructor(props: INewApplicationProps, state: INewApplicationState) {
    super(props);
    this.state = {
      hideDialog: true,
      btnSave: false,
      firstDayOfWeek: DayOfWeek.Monday,
      value: {
        Title: '',
        StartDate: new Date(),
        EndDate: null,
        Admin: ''
      }
    };

  }

  private setValue = (value: any, type: string): void => {
    this._dialogTitle = 'One or more days of selected days already applied!';
    let isDateAlreadyApplied: boolean = false;

    if (type === 'Title') {
      this._newItem.Title = value;
      this.setState(prevState => ({
        value: { ...prevState.value, Title: value }
      }));
    }

    else if (type === 'StartDate') {
      console.log(this._allExistingDates)
      this._allExistingDates.forEach(e => {
        const start = e.StartDate; const end = e.EndDate; const applyEnd = value;
        if (start <= applyEnd && applyEnd <= end) {
          isDateAlreadyApplied = true;
          this._dialogText = `'You have already applied semester from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}. Choose new dates for Semester`
        }
      });
      if (isDateAlreadyApplied) { this._showDialog(this._newItem) }
      else {
        this._newItem.StartDate = value;
        this.setState(prevState => ({
          value: { ...prevState.value, StartDate: value }
        }));
      }
    }

    else if (type === 'EndDate') {
      this._allExistingDates.forEach(e => {
        const start = e.StartDate; const end = e.EndDate; const applyEnd = value;
        if (start <= applyEnd && applyEnd <= end) {
          isDateAlreadyApplied = true;
          this._dialogText = `'You have already applied semester from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}. Choose new dates for Semester`
        }
      });
      if (isDateAlreadyApplied) { this._showDialog(this._newItem) }
      else {
        this._newItem.EndDate = value;
        this.setState(prevState => ({
          value: { ...prevState.value, EndDate: value }
        }));
      }
    }
    // else if (type === 'Admin') {
    //   this._newItem.HandlerName = value[0].text;
    //   this.setState(prevState => ({
    //     value: { ...prevState.value, HandlerName: (value[0] === undefined) ? null : value[0].text}
    //   }));
    //   console.log('Its >>>>' + value[0].text);
    // }

    if ((this._newItem.StartDate != null && this._newItem.EndDate != null) && (this._newItem.StartDate >= this._newItem.EndDate)) {
      this._dialogTitle = 'Error!';
      this._dialogText = 'Start date cannot be later than or same as End date !';
      this._showDialog(this._newItem);
    }
  }

  private showAllDates = () => {
    this._allExistingDates = this.props.myItems.map((item) => {
      let appliedDates: IDateNow = {
        StartDate: new Date(String(item.StartDate).slice(0, 10) + 'T00:00:00Z'),
        EndDate: new Date(String(item.EndDate).slice(0, 10) + 'T00:00:00Z')
      };
      return appliedDates;
    });
  }

  private _validateForm = (): void => {
    if (this._newItem.EndDate != null && this._newItem.StartDate != null && this._newItem.Title != '' && this._newItem.Admin != '') {
      console.log(this._newItem.Admin)
      this.props.addNewData(this._newItem);
    }
    else {
      this._dialogTitle = 'Information';
      this._dialogText = 'Fill up all the information needed !';
      this._showDialog(this._newItem);
    }
  }

  private _getPeoplePickerItems =( admin: any[]) => {
    this._newItem.Admin = admin[0].text;
    //console.log('Itemss:', admin[0].text);
    this.setState(prevState => ({
      value: { ...prevState.value, Admin:(admin[0] === undefined) ? null : admin[0].text}
    }))
  }

  private _showDialog = (value: INewApp): void => { this.setState({ hideDialog: false, value: value }) }
  private _closeDialog = (): void => { this.setState({ hideDialog: true }) }

  public render(): React.ReactElement<INewApplicationProps> {
    this.showAllDates();
    return (
      <div className={styles.semester}>
        <br /><br />
        <TextField
          label='Title'
          onChanged={(e) => this.setValue(e, 'Title')}
          required
        />
        <DatePicker
          firstDayOfWeek={this.state.firstDayOfWeek} strings={this.props._dayPickerStrings} showWeekNumbers={true} firstWeekOfYear={1} showMonthPickerAsOverlay={true}
          label="StartDate" minDate={new Date()} value={this._newItem.StartDate}
          onSelectDate={(e) => this.setValue(e, 'StartDate')}
          isRequired
        />
        <DatePicker
          firstDayOfWeek={this.state.firstDayOfWeek} strings={this.props._dayPickerStrings} showWeekNumbers={true} firstWeekOfYear={1} showMonthPickerAsOverlay={true}
          label='EndDate' minDate={this._newItem.StartDate} value={this._newItem.EndDate}
          onSelectDate={(e) => this.setValue(e, 'EndDate')}
          isRequired
        />
        <PeoplePicker
          context={this.props.context} titleText="Handler Name" personSelectionLimit={1} groupName={'Semester Site Owners'} showtooltip={true} 
          disabled={false} isRequired={true} selectedItems={this._getPeoplePickerItems} showHiddenInUI={false} principalTypes={[PrincipalType.User]}
          resolveDelay={1000} ensureUser={true} />

        <br /><br />
        
        <PrimaryButton className={styles.button} text='Save' onClick={() => this._validateForm()} />
        <Dialog
          hidden={this.state.hideDialog} onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: this._dialogTitle,
            subText: this._dialogText
          }}
          modalProps={{
            titleAriaId: this._labelId,
            subtitleAriaId: this._subTextId,
            isBlocking: true
          }}
        >
          <DialogFooter>
            <PrimaryButton className={styles.button} onClick={() => this._closeDialog()} text="Ok" />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}
