import * as React from 'react';
import styles from '../Styles/Semester.module.scss';
import { IListItems, IHandleApplicationsProps, IHandleApplicationsState } from '../Interfaces/ISemesterInterfaces';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode, Link, PrimaryButton, Modal, TextField, DefaultButton, Dropdown } from 'office-ui-fabric-react/lib/';
import { getId } from 'office-ui-fabric-react/lib/Utilities';



export default class HandleApplications extends React.Component<IHandleApplicationsProps, IHandleApplicationsState> {
    private _titleId: string = getId('title');
    private _subtitleId: string = getId('subText');
    private _updateValue: IListItems;

    constructor(props: IHandleApplicationsProps, state: IHandleApplicationsState) {
        super(props);
        const columns: IColumn[] = [
            { key: 'col1', name: 'Title', fieldName: 'Title', minWidth: 50, maxWidth: 100, isResizable: true, data: 'string', isPadded: true },
            { key: 'col2', name: 'Start Date', fieldName: 'StartDate', minWidth: 50, maxWidth: 70, isResizable: true, data: 'number', isPadded: true, onRender: (item) => (<div>{item.StartDate.slice(0, 10)}</div>) },
            { key: 'col3', name: 'End Date', fieldName: 'EndDate', minWidth: 50, maxWidth: 70, isResizable: true, data: 'string', isPadded: true, onRender: (item) => (<div>{item.EndDate.slice(0, 10)}</div>) },
            { key: 'col4', name: 'Status', fieldName: 'Status', minWidth: 60, maxWidth: 70, isResizable: true, data: 'string', isPadded: true },
            { key: 'col5', name: 'Applicant', fieldName: 'Author', minWidth: 100, maxWidth: 150, isResizable: true, data: 'string', isPadded: true, onRender: (item) => (<div>{item.Author.Title}</div>) },
            { key: 'col6', name: '', fieldName: 'Decide', minWidth: 50, maxWidth: 100, isResizable: true }
        ];

        this.state = {
            showModal: false,
            columns: columns,
            items: props.items,
            item: { ID: 0, Title: '', StartDate: null, EndDate: null, Status: '', Admin: '', Author: { Title: ''}}
        };
    }

    private _showModal = (): void => { this.setState({ showModal: true }) }
    private _closeModal = (): void => { this.setState({ showModal: false })}
    private _getKey(item: any, index?: number): string { return item.key}

    private _onRenderItemColumn = (item: IListItems, index: number, column: IColumn): JSX.Element => {
        if (column.fieldName === 'Decide') {
            if (item.Status === 'Accepted' || item.Status === 'Rejected') return <div><strong style={{color:'yellow'}}>Decided!</strong></div>;
            return <Link onClick={() => this.editItem(item)} data-selection-invoke={true}><strong style={{color:'lightblue'}}>Look</strong></Link>;
        }
        return item[column.fieldName];
    }

    private editItem = (item: IListItems): void => {
        this.setState({ item: item });
        this._updateValue = item;
        this._updateValue.Status = 'Proceed';
        this._showModal();
    }

    private setValue = (value: string): void => {
        let item: IListItems = this.state.item;
        item.Status = value;
        this.setState({ item: item });
        this._updateValue = {
            ID: item.ID,
            Title: item.Title,
            StartDate: item.StartDate,
            EndDate: item.EndDate,
            Status: item.Status,
            Admin: '',
            Author: item.Author
        };
    }

    public render(): React.ReactElement<IHandleApplicationsProps> {
        return (
            <div className={styles.semester}>
                <br/><br/>
                <DetailsList items={this.state.items} columns={this.state.columns} selectionMode={SelectionMode.none} getKey={this._getKey}
                    setKey="none" layoutMode={DetailsListLayoutMode.justified} isHeaderVisible={true} onRenderItemColumn={this._onRenderItemColumn}
                />
                <Modal titleAriaId={this._titleId} subtitleAriaId={this._subtitleId} isOpen={this.state.showModal} onDismiss={this._closeModal}
                    isBlocking={true} containerClassName={styles.container}>
                    <div className={styles.semester}>
                        <div className={styles.header}>
                            <span id={this._titleId}>{this.state.item.Title}</span>
                        </div>
                        <div id={this._subtitleId} className={styles.body}>
                            <TextField label='Title' defaultValue={this.state.item.Title} disabled />
                            <TextField label='Start Date' defaultValue={String(this.state.item.StartDate).slice(0, 10)} disabled />
                            <TextField label='End Date' defaultValue={String(this.state.item.EndDate).slice(0, 10)} disabled />

                            <Dropdown label='Status' defaultValue={'Proceed'} options={this.props._options}
                                onChanged={(e) => { this.setValue(e.text) }}
                            />
                            <TextField label='Handler Name' defaultValue={this.state.item.Admin} disabled />
                            <br/><br/>
                            <PrimaryButton text='Save' onClick={() => { this.props.decideSemester(this._updateValue); this._closeModal(); }}
                            />
                            <DefaultButton text='Cancel' onClick={() => this._closeModal()}
                            />
                            <br/>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
