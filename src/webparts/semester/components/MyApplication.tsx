import * as React from 'react';
import styles from '../Styles/Semester.module.scss';
import { IListItems, IMyApplicationsProps, IMyApplicationState } from '../Interfaces/ISemesterInterfaces';
import {
    DetailsList, DetailsListLayoutMode, IColumn, SelectionMode, Link, PrimaryButton, Modal,
    TextField, DatePicker, DefaultButton, DayOfWeek, Dialog, DialogFooter, DialogType, getId
} from 'office-ui-fabric-react';

export default class MyApplication extends React.Component<IMyApplicationsProps, IMyApplicationState> {
    private _titleId: string = getId('title');
    private _subtitleId: string = getId('subText');
    private _labelId: string = getId('dialogLabel');
    private _subTextId: string = getId('subTextLabel');

    private updateVal: IListItems;
    private startDate: Date;
    private endDate: Date;
    private _updatedApplication: Date = new Date();
    private _deleteText: string;
    private _deleteItem: IListItems;

    constructor(props: IMyApplicationsProps, state: IMyApplicationState) {
        super(props);

        const columns: IColumn[] = [
            { key: 'col1', name: 'Title', fieldName: 'Title', minWidth: 50, maxWidth: 100, isResizable: true, data: 'string', isPadded: true },
            { key: 'col2', name: 'Start Date', fieldName: 'StartDate', minWidth: 50, maxWidth: 70, isResizable: true, data: 'number', isPadded: true, onRender: (item) => (<div>{item.StartDate.slice(0, 10)}</div>) },
            { key: 'col3', name: 'End Date', fieldName: 'EndDate', minWidth: 50, maxWidth: 70, isResizable: true, data: 'string', isPadded: true, onRender: (item) => (<div>{item.EndDate.slice(0, 10)}</div>) },
            { key: 'col4', name: 'Status', fieldName: 'Status', minWidth: 60, maxWidth: 70, isResizable: true, data: 'string', isPadded: true },
            { key: 'col5', name: 'Handler', fieldName: 'Handler Name', minWidth: 70, maxWidth: 70, isResizable: true, data: 'string', isPadded: true, onRender: (item) => (<div>{item.Admin}</div>) },
            { key: 'col6', name: '', fieldName: 'Update', minWidth: 50, maxWidth: 100, isResizable: true },
            { key: 'col7', name: '', fieldName: 'Delete', minWidth: 50, maxWidth: 100, isResizable: true }
        ];

        this.state = {
            hideDialog: true,
            firstDayOfWeek: DayOfWeek.Monday,
            showModal: false,
            columns: columns,
            allItems: props.myItems,
            items: [],
            item: { ID: 0, Title: '', StartDate: null, EndDate: null, Status: '', Admin: '', Author: { Title: '' } }
        };
    }

    private _showModal = (): void => { this.setState({ showModal: true }) }
    private _closeModal = (): void => { this.setState({ showModal: false }) }
    private _closeDialog = (): void => { this.setState({ hideDialog: true }) }
    private _showDialog = (thisApp: string): void => {
        this._deleteText = ` Do you want to remove ${thisApp} ? `;
        this.setState({ hideDialog: false });
    }
    private _getKey(item: any, index?: number): string { return item.key }

    private setValue = (value: any, type: string): void => {
        let item: IListItems = this.state.item;
        if (type === 'Title') {
            item.Title = value;
        }
        else if (type === 'StartDate') {
            item.StartDate = value.toLocaleDateString();
        }
        else if (type === 'EndDate') {
            item.EndDate = value.toLocaleDateString();
        }
        this.setState({ item: item });
        this.updateVal = {
            ID: item.ID,
            Title: item.Title,
            StartDate: item.StartDate,
            EndDate: item.EndDate,
            Status: item.Status,
            Admin: item.Admin,
            Author: item.Author
        };
    }


    private editItem = (item: IListItems): void => {
        this.setState({ item: item });
        this.updateVal = item;
        this.startDate = new Date(String(item.StartDate).slice(0, 10));
        this.endDate = new Date(String(item.EndDate).slice(0, 10));
        this._showModal();
    }

    private deleteItem = (item: IListItems): void => {
        this._deleteItem = item;
        this._showDialog(item.Title);
    }

    private _onRenderItemColumn = (item: IListItems, index: number, column: IColumn): JSX.Element => {
        if (column.fieldName === 'Update') {
            if (item.Status === 'Accepted' || item.Status === 'Rejected') return <div><strong style={{ color: 'yellow' }}>Decided!</strong></div>;
            return <Link onClick={() => this.editItem(item)} data-selection-invoke={true}><strong style={{ color: 'green' }}>Update</strong></Link>;
        }
        if (column.fieldName === "Delete") {
            if (item.Status === 'Accepted' || item.Status === 'Rejected') return <div></div>;
            return (<Link onClick={() => this.deleteItem(item)} data-selection-invoke={true} ><strong style={{ color: 'red' }}>Delete</strong></Link>);
        }
        return item[column.fieldName];
    }

    public componentWillMount() {
        this.showUpdatedApplication(this._updatedApplication);
    }
    private showUpdatedApplication = (newDate: Date): void => {
        this._updatedApplication = newDate;
        const applications = this.props.myItems.filter((app) => {
            let start = new Date(String(app.StartDate).slice(0, 10));
            if (start >= this._updatedApplication) {
                return (app);
            }
        });
        this.setState({ items: applications });
    }

    public render(): React.ReactElement<IMyApplicationsProps> {
        return (
            <div className={styles.semester}>
                <br /><br />
                <DatePicker
                    label='Show my semester applications after :' value={this._updatedApplication} firstDayOfWeek={this.state.firstDayOfWeek} strings={this.props._dayPickerStrings}
                    showWeekNumbers={true} firstWeekOfYear={1} showMonthPickerAsOverlay={true} onSelectDate={(val) => this.showUpdatedApplication(val)} isRequired
                />

                <DetailsList items={this.state.items} columns={this.state.columns} selectionMode={SelectionMode.none} getKey={this._getKey}
                    setKey="none" layoutMode={DetailsListLayoutMode.justified} isHeaderVisible={true} onRenderItemColumn={this._onRenderItemColumn}
                />

                <Dialog
                    hidden={this.state.hideDialog} onDismiss={this._closeDialog}
                    dialogContentProps={{ type: DialogType.normal, title: 'Are you sure to Delete?', subText: this._deleteText }}
                    modalProps={{ titleAriaId: this._labelId, subtitleAriaId: this._subTextId, isBlocking: true, styles: { main: { maxWidth: 500 } } }}
                >
                    <DialogFooter>
                        <PrimaryButton onClick={() => { this.props.deleteItem(this._deleteItem); this._closeDialog(); }} text="Delete" />
                        <DefaultButton onClick={() => this._closeDialog()} text="Cancel" />
                    </DialogFooter>
                </Dialog>

                <Modal titleAriaId={this._titleId} subtitleAriaId={this._subtitleId} isOpen={this.state.showModal} onDismiss={this._closeModal}
                    isBlocking={true} containerClassName={styles.container}>

                    <div className={styles.semester}>
                        <div className={styles.header}>
                            <span id={this._titleId}>{this.state.item.Title}</span>
                        </div>
                        <div id={this._subtitleId} className={styles.body}>
                            <TextField label='Title' defaultValue={this.state.item.Title} onChanged={(val) => this.setValue(val, 'Title')} required />

                            <DatePicker label='Start Date' value={this.startDate} firstDayOfWeek={this.state.firstDayOfWeek} strings={this.props._dayPickerStrings}
                                showWeekNumbers={true} firstWeekOfYear={1} showMonthPickerAsOverlay={true} onSelectDate={(val) => this.setValue(val, 'StartDate')} isRequired
                            />

                            <DatePicker label='End Date' value={this.endDate} firstDayOfWeek={this.state.firstDayOfWeek} strings={this.props._dayPickerStrings} showWeekNumbers={true}
                                firstWeekOfYear={1} showMonthPickerAsOverlay={true} onSelectDate={(val) => this.setValue(val, 'EndDate')} isRequired
                            />

                            <TextField label='Status' defaultValue={'' + this.state.item.Status} disabled />

                            <TextField label='Handler Name' defaultValue={this.state.item.Admin} disabled />
                            <br /><br />

                            <PrimaryButton text='Save' onClick={() => { this.props.updateItem(this.updateVal); this._closeModal() }} />
                            <DefaultButton text='Cancel' onClick={() => this._closeModal()} />
                            <br />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

