import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { SetValueLabel, FormatNumber } from '../../../../utility/tools'
import { Tag } from 'antd';
import { Formik, Form } from "formik";
import { Printer } from "react-feather";
import { toast } from "react-toastify";
import FormikControl from "../../../../components/common/formik/FormikControl";

import style from './style/style.css'
import * as  gcs from '../../../../services/garbageCollectionService';
import * as  vs from '../../../../services/voyageService';
import url from '../../../../urls.json'
import { propTypes } from "react-country-flag";

toast.configure({ bodyClassName: "customFont" });

const initialValues = {
    ListOfVoyages: [],
    voyageData: {},
    issuedBill: {}
}

const GarbageCollectionBillPage = (props) => {

    const [state, setState] = useState({
        ListOfVoyages: [],
        voyageData: {},
        issuedBill: {}
    });

    useEffect(() => {
        (async function fetchAllTariffs() {
            const response = await vs.GetLast10Voyages();
            if (response.data.result) {
                let temp = SetValueLabel(response.data.data, 'VoyageId', 'VoyageVessel');
                setState((prevState) => ({ ...prevState, ListOfVoyages: temp }));
            }
            else
                toast.error(response.data.data[0]);
        })();
    }, [])

    const handleSelectedVoyageChanged = async (param) => {
        await FireUp(param.value);
    }

    const handleInvoicePrint = async () => {
        console.log("🚀 ~ file: garbageCollectionBillPage.jsx ~ line 50 ~ handleInvoicePrint ~ result")
        let result = (await gcs.GetAllBills(state.voyageData.gcInvoiceId)).data.data[0]
        result.billType = 'GarbageCollection';
        return props.history.push('/billing/garbage-collection/Invoice-Print', { data: result });
    }

    const handleInvoiceClicked = async (isPreInvoice) => {
        try {
            let result = await gcs.Calculate(voyageData.VoyageId, isPreInvoice)
            console.log("handleInvoiceClicked -> invoice", result)
            if (result.data.result) {
                let invoice = result.data.data[0];
                if (!isPreInvoice) {
                    toast.success(
                        <div>
                            <p>Invoice issued successfully</p>
                            <p>Invoice-No: {invoice.invoiceNo}</p>
                        </div>);
                    await FireUp(voyageData.VoyageId);
                }
                else
                    toast.success(
                        <div>
                            <p>Preinvoice issued successfully</p>
                            <p>Price: {FormatNumber(invoice.priceD)}$, {FormatNumber(invoice.priceR)}Rial</p>
                        </div>);
            }

        }
        catch (ex) {
            toast.error(ex.message);
        }  
    }

    const FireUp = async (voyageId) => {
        let response = await vs.getVoyageDetail(voyageId);
        if (response.data.result)
            setState(ps => ({ ...ps, voyageData: response.data.data[0] }))
        else
            toast.error(response.data.data[0]);
    }

    let { voyageData, ListOfVoyages } = state;

    return (
        <React.Fragment>
            <Formik
                initialValues={initialValues}
            >
                {
                    () => {
                        return (
                            <React.Fragment>
                                <Form className='custom-background'>
                                    <div className="form-body">
                                        <Row>
                                            <Col md="6">
                                                <FormikControl
                                                    control="customSelect"
                                                    name="selectTariff"
                                                    options={ListOfVoyages ?? []}
                                                    label="Select voyage"
                                                    onSelectedChanged={
                                                        handleSelectedVoyageChanged
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="row details">
                                        <div className="col-6">Voyage/vessel: {voyageData.VoyageVessel}</div>
                                        <div className="col-6">Voyage status: <Tag color={voyageData.Status == 'close' ? 'red' : 'green'}>{voyageData.Status}</Tag>
                                        </div>
                                    </div>
                                    <div className="row details">
                                        <div className="col-6">Voyage-no (in): {voyageData.VoyageNoIn}</div>
                                        <div className="col-6">Voyage-no (out): {voyageData.VoyageNoOut}</div>
                                    </div>
                                    <hr />
                                    <div className="row details">
                                        <div className="col-4">Nationality: {voyageData.Nationality}</div>
                                        <div className="col-4">Flag: {voyageData.Flag}</div>
                                        <div className="col-4">Call-sign: {voyageData.CallSign}</div>
                                    </div>
                                    <div className="row details">
                                        <div className="col-4">Origin port: {voyageData.OriginPort}</div>
                                        <div className="col-4">Previous port: {voyageData.PreviousPort}</div>
                                        <div className="col-4">Next port: {voyageData.NextPort}</div>
                                    </div>
                                    <div className="row details">
                                        <div className="col-4">Vessel type: {voyageData.VesselType}</div>
                                        <div className="col-4">Vessel length: {voyageData.VesselLength}</div>
                                        <div className="col-4">Gross tonage: {voyageData.GrossTonage}</div>
                                        <div className="col-4">#Bays: {voyageData.NumOfBays}</div>
                                        <div className="col-4">#ActiveCrane: {voyageData.ActiveCraneQty}</div>
                                    </div>
                                    <hr />
                                    <div className="row details">
                                        <div className="col-3">Estimated arrival time: {voyageData.ETA}</div>
                                        <div className="col-3">Estimated departure time: {voyageData.ETD}</div>
                                        <div className="col-3">Actual arrival time: {voyageData.ATA}</div>
                                        <div className="col-3">Actual departure time: {voyageData.ATD}</div>
                                    </div>

                                    <hr hidden={voyageData.gcInvoiceNo == null} />
                                    <div hidden={voyageData.gcInvoiceNo == null} className="row details">
                                        <div className="col-3">Invoice-no: {voyageData.gcInvoiceNo}</div>
                                        <div className="col-3">Invoice Date: {voyageData.gcInvoiceDate}</div>
                                        <div className="col-3">Price($): {voyageData.gcPriceD}</div>
                                        <div className="col-3">Price(R): {voyageData.gcPriceR}</div>
                                    </div>
                                    <hr />

                                    <div hidden={!voyageData.VoyageId} className="row">
                                        <button disabled={voyageData.Status == 'open' || voyageData.gcInvoiceNo != null} className="btn btn-primary ml-3" onClick={() => handleInvoiceClicked(false)}>Invoice</button>
                                        <button disabled={voyageData.Status == 'open' || voyageData.gcInvoiceNo != null} className="btn btn-secondary ml-1" onClick={() => handleInvoiceClicked(true)}>Pre invoice</button>
                                        <button type='button' disabled={voyageData.gcInvoiceNo == null} className="btn btn-secondary ml-1" onClick={() => handleInvoicePrint()}> <Printer size={16} /> Print</button>
                                    </div>
                                </Form>
                            </React.Fragment>
                        )
                    }}

            </Formik>
        </React.Fragment>
    );
}

export default GarbageCollectionBillPage;