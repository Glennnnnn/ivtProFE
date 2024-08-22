import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from "moment";


// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FDFDFD',
        padding: 20,
        position: 'absolute'
    },
    header: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    middleHeader: {
        fontSize: 24,
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftHeader: {
        fontSize: 9,
        color: 'black',
        lineHeight: 1.5,
    },
    rightHeader: {
        fontSize: 16,
        color: '#5F9EA0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dividerLine: {
        borderTop: '2px solid #5F9EA0',
        marginVertical: 10,
    },
    body: {
        marginBottom: 20,
    },
    topSection: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    topLeft: {
        flex: 1,
        fontSize: 11,
        color: 'black',
        lineHeight: 1.5,
    },
    topRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    lightBackground: {
        width: '33%',
        backgroundColor: '#ADD8E6',
        color: '#5F9EA0',
        fontSize: 11,
        lineHeight: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkBackground: {
        width: '33%',
        backgroundColor: '#5F9EA0',
        color: 'white',
        fontSize: 11,
        lineHeight: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightBackgroundNoPrice: {
        width: '50%',
        backgroundColor: '#ADD8E6',
        color: '#5F9EA0',
        fontSize: 11,
        lineHeight: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkBackgroundNoPrice: {
        width: '50%',
        backgroundColor: '#5F9EA0',
        color: 'white',
        fontSize: 11,
        lineHeight: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscriptName: {
        flex: 0.7,
        color: '#5F9EA0',
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        lineHeight: 1.5,
    },
    subscriptNumber: {
        flex: 0.3,
        color: 'black',
        fontSize: 11,
        lineHeight: 1.5,
        textAlign: 'center',
    },
    smallSubscriptName: {
        flex: 0.7,
        color: '#5F9EA0',
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        lineHeight: 1.5,
    },
    smallSubscriptNumber: {
        flex: 0.3,
        color: 'black',
        fontSize: 9,
        lineHeight: 1.5,
        textAlign: 'center',
    },
    middleSection: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    middleRow: {
        flex: 1,
        fontSize: 11,
        color: 'black',
        lineHeight: 1.5,
    },
    bottomSection: {
        top: 20,
        position: 'relative',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        marginBottom: 5,
    },
    tableHeaderCell: {
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    tableItemCell: {
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    tableRow: {
        flexDirection: 'row',
        lineHeight: 1.5,
        marginBottom: 5,
    },
    tableRowCell: {
        flexDirection: 'row',
        lineHeight: 1.5,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#A9A9A9',
        flexWrap: 'wrap',
    },
    totalDue: {
        flex: 0.7,
        color: '#5F9EA0',
        fontFamily: 'Helvetica-Bold',
        fontSize: 13,
        lineHeight: 1.5,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderTop: '1px solid #5F9EA0',
        borderBottom: '2px solid #5F9EA0',
    },
    totalDueNumber: {
        flex: 0.3,
        color: '#5F9EA0',
        fontFamily: 'Helvetica-Bold',
        fontSize: 13,
        lineHeight: 1.5,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderTop: '1px solid #5F9EA0',
        borderBottom: '2px solid #5F9EA0',
    },
    thankYou: {
        flex: 0.3,
        color: '#5F9EA0',
        fontFamily: 'Helvetica-Bold',
        fontSize: 13,
        lineHeight: 1.5,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    footer: {
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 12,
        padding: 10,
    },
    topFooter: {
        flexDirection: 'row',
        padding: 10,
    },
    leftTopFooter: {
        flex: 1,
        textAlign: 'left',
        fontFamily: 'Helvetica-Bold',
        fontSize: 14,
    },
    rightTopFooter: {
        flex: 1,
        textAlign: 'left',
        fontFamily: 'Helvetica-Bold',
        fontSize: 14,
    },
    claims: {
        textAlign: 'center',
        fontSize: 10,
        marginTop: 10,
    }
});

const renderDate = (text) => {
    return moment(text).format('DD/MM/YYYY');
};

const renderDueDate = (data) => {
    const originalDate = moment(data.orderDate);

    if (data.customerInterPo === null || "immediately" === data.customerInterPo?.creditTerm || data.customerInterPo === undefined) {
        return originalDate.format('DD/MM/YYYY');
    } else if (data.customerInterPo.creditTerm.includes("30")) {
        return originalDate.add(1, 'month').endOf('month').format('DD/MM/YYYY');
    } else if (data.customerInterPo.creditTerm.includes("14")) {
        return originalDate.add(14, 'day').format('DD/MM/YYYY');
    } else {
        return originalDate.format('DD/MM/YYYY');
    }
}

const renderTags = (tags) => {
    if (!tags || tags.length === 0) {
        return "";
    }

    return tags.map(tag => {
        if (tag !== null) {
            return `${tag.tagName}: ${tag.tagValue}`;
        } else {
            return "";
        }
    }).join(", ");
}

const renderCompanyandCustomerName = (data) => {
    const shouldRenderCompany = data.orderCompanyName !== "";
    const shouldRenderCustomer = data.orderCustomerName !== "";

    return (
        <>
            {shouldRenderCompany && <Text>{data.orderCompanyName}</Text>}
            {shouldRenderCustomer && <Text>{data.orderCustomerName}</Text>}
        </>
    );
};

const renderTaxTitle = (data) => {
    if (data.orderTaxType === "" || data.orderTaxType === null || data.orderTaxType === "No Tax") {
        return "GST (No Tax)";
    }
    else {
        return "GST (" + data.orderTaxType + " 10%)";
    }
}

const renderTaxNumber = (data) => {
    if (data.orderTaxType === "Include") {
        return ((parseFloat(data.orderSubTotal) * (1 - parseFloat(data.orderDiscount) / 100) + parseFloat(data.orderShippingFee)) / 11).toFixed(2);
    }
    else if (data.orderTaxType === "Exclude") {
        return ((parseFloat(data.orderSubTotal) * (1 - parseFloat(data.orderDiscount) / 100) + parseFloat(data.orderShippingFee)) * 0.1).toFixed(2);
    }
    else {
        return 0.00.toFixed(2);
    }
}

const renderOrderTotalNumber = (data) => {
    if (data.orderTaxType === "Include") {
        return (parseFloat(data.orderSubTotal) * (1 - parseFloat(data.orderDiscount) / 100) + parseFloat(data.orderShippingFee)).toFixed(2);
    }
    else if (data.orderTaxType === "Exclude") {
        return ((parseFloat(data.orderSubTotal) * (1 - parseFloat(data.orderDiscount) / 100) + parseFloat(data.orderShippingFee)) * 1.1).toFixed(2);
    }
    else {
        return (parseFloat(data.orderSubTotal) * (1 - parseFloat(data.orderDiscount) / 100) + parseFloat(data.orderShippingFee)).toFixed(2);
    }
}

const renderTotalNumber = (data) => {
    if (data.orderTaxType === "Exclude") {
        return ((parseFloat(data.orderSubTotal) * (1 - parseFloat(data.orderDiscount) / 100) + parseFloat(data.orderShippingFee)) * 1.1 + parseFloat(data.orderPreBalance)).toFixed(2);
    }
    else {
        return (parseFloat(data.orderSubTotal) * (1 - parseFloat(data.orderDiscount) / 100) + parseFloat(data.orderShippingFee) + parseFloat(data.orderPreBalance)).toFixed(2);
    }
}


// Create Document Component
const MyDocument = ({ data, showPrice = true }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.header}>
                {data.isCashSale ?
                    <View style={styles.leftHeader}></View> :
                    <View style={styles.leftHeader}>
                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>Pioneer Aluminium Pty Ltd</Text>
                        <Text>70 North View Drive</Text>
                        <Text>Sunshine West VIC  3020</Text>
                        <Text>info@pioneertrading.com.au</Text>
                        <Text>Tel: 03 9312 6218</Text>
                    </View>
                }

                {
                    !data.isCashSale ?
                        <View style={styles.middleHeader}>
                            <Text style={{ fontFamily: 'Helvetica-Bold' }}> {showPrice ? "Tax Invoice" : "Delivery Docket"}</Text>
                        </View> : <View style={styles.middleHeader}></View>
                }

                <View style={styles.rightHeader}>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>Order Id {data.orderId}</Text>
                </View>
            </View>

            {/* Divider Line */}
            <View style={styles.dividerLine} />

            {/* Body Section */}
            <View style={styles.body}>
                {/* Top Section */}
                <View style={styles.topSection}>
                    <View style={styles.topLeft}>
                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>Invoice to</Text>
                        {renderCompanyandCustomerName(data)}
                        <Text>{data.orderBillingAddress}</Text>

                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>Ship to</Text>
                        {renderCompanyandCustomerName(data)}
                        <Text>{data.orderDeliveryAddress}</Text>
                    </View>
                    {
                        showPrice ?
                            <View style={styles.topRight}>
                                <View style={styles.lightBackground}>
                                    <Text>DATE</Text>
                                    <Text>{renderDate(data.orderDate)}</Text>
                                </View>
                                <View style={styles.darkBackground}>
                                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>PLEASE PAY</Text>
                                    <Text>AUD {renderTotalNumber(data)}</Text>
                                </View>
                                <View style={styles.lightBackground}>
                                    <Text>DUE DATE</Text>
                                    <Text>{renderDueDate(data)}</Text>
                                </View>
                            </View> :
                            <View style={styles.topRight}>
                                <View style={styles.lightBackgroundNoPrice}>
                                    <Text>DATE</Text>
                                    <Text>{renderDate(data.orderDate)}</Text>
                                </View>
                                <View style={styles.darkBackgroundNoPrice}>
                                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>DUE DATE</Text>
                                    <Text>{renderDueDate(data)}</Text>
                                </View>
                            </View>
                    }
                </View>

                {/* Middle Section */}
                <View style={styles.middleSection}>
                    <View style={styles.middleRow}>
                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>SHIP DATE</Text>
                        <Text> {renderDate(data.orderDate)} </Text>
                    </View>
                    <View style={styles.middleRow}>
                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>TRACKING NO</Text>
                        <Text> {data.orderId} </Text>
                    </View>
                    <View style={styles.middleRow}>
                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>CUSTOMER ORDER NO</Text>
                        <Text> {data.customerOrderNo} </Text>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection} wrap>
                    {showPrice ?
                        <View style={styles.tableHeader}>
                            <Text style={{ ...styles.tableHeaderCell, flex: 0.15 }}>ITEM CODE</Text>
                            <Text style={{ ...styles.tableHeaderCell, flex: 0.45 }}>DESCRIPTION</Text>
                            <Text style={{ ...styles.tableHeaderCell, flex: 0.10 }}>QTY</Text>
                            <Text style={{ ...styles.tableHeaderCell, flex: 0.10 }}>RATE</Text>
                            <Text style={{ ...styles.tableHeaderCell, flex: 0.10 }}>DISCOUNT(%)</Text>
                            <Text style={{ ...styles.tableHeaderCell, flex: 0.10 }}>AMOUNT</Text>
                        </View> :
                        <View style={styles.tableHeader}>
                            <Text style={{ ...styles.tableHeaderCell, flex: 0.25 }}>ITEM CODE</Text>
                            <Text style={{ ...styles.tableHeaderCell, flex: 0.5 }}>DESCRIPTION</Text>
                            <Text style={{ ...styles.tableHeaderCell, flex: 0.25 }}>QTY</Text>
                        </View>
                    }


                    {/* Table Body */}
                    {data.orderIvtPoList && data.orderIvtPoList.map((item, index) => (
                        showPrice ?
                            <View key={index} style={styles.tableRowCell} wrap>
                                <Text style={{ ...styles.tableHeaderCell, flex: 0.15 }}>{item.ivtSubClassCode ?? ""}</Text>
                                <Text style={{ ...styles.tableItemCell, flex: 0.45 }} >{item.ivtClassName} {renderTags(item.tags)}   {item.orderIvtDesc ?? ""}</Text>
                                <Text style={{ ...styles.tableItemCell, flex: 0.10 }}>{item.orderIvtQty}</Text>
                                <Text style={{ ...styles.tableItemCell, flex: 0.10 }}>{parseFloat(item.orderIvtPrice).toFixed(2)}</Text>
                                <Text style={{ ...styles.tableItemCell, flex: 0.10 }}>{item.orderIvtDiscount}</Text>
                                <Text style={{ ...styles.tableItemCell, flex: 0.10 }}>{parseFloat(item.orderIvtTotal).toFixed(2)}</Text>
                            </View> :
                            <View key={index} style={styles.tableRowCell} wrap>
                                <Text style={{ ...styles.tableItemCell, flex: 0.25 }}>{item.ivtSubClassCode ?? ""}</Text>
                                <Text style={{ ...styles.tableItemCell, flex: 0.5 }} >{item.ivtClassName} {renderTags(item.tags)}   {item.orderIvtDesc ?? ""}</Text>
                                <Text style={{ ...styles.tableItemCell, flex: 0.25 }}>{item.orderIvtQty}</Text>
                            </View>
                    ))}

                    {
                        showPrice ?
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 0.5 }}>
                                    <View style={{ ...styles.middleRow, padding: 5 }}>
                                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>Note</Text>
                                        <Text> {data.orderNote} </Text>
                                    </View>
                                </View>

                                <View style={{ flex: 0.5 }}>
                                    <View style={styles.tableRow}>
                                        <Text style={styles.smallSubscriptName}>SUBTOTAL</Text>
                                        <Text style={styles.smallSubscriptNumber}>{(parseFloat(data.orderSubTotal)).toFixed(2)}</Text>
                                    </View>

                                    <View style={styles.tableRow}>
                                        <Text style={styles.smallSubscriptName}>DISCOUNT(%)</Text>
                                        <Text style={styles.smallSubscriptNumber}>{data.orderDiscount}</Text>
                                    </View>

                                    <View style={styles.tableRow}>
                                        <Text style={styles.smallSubscriptName}>SHIPPING</Text>
                                        <Text style={styles.smallSubscriptNumber}>{parseFloat(data.orderShippingFee).toFixed(2)}</Text>
                                    </View>

                                    {data.isCashSale || data.orderTaxType === "" || data.orderTaxType === null || data.orderTaxType === "No Tax" ?
                                        <></> :
                                        <View style={styles.tableRow}>
                                            <Text style={styles.smallSubscriptName}>{renderTaxTitle(data)}</Text>
                                            <Text style={styles.smallSubscriptNumber}>{renderTaxNumber(data)}</Text>
                                        </View>
                                    }

                                    <View style={styles.tableRow}>
                                        <Text style={styles.subscriptName}>ORDER TOTAL</Text>
                                        <Text style={styles.subscriptNumber}>{renderOrderTotalNumber(data)}</Text>
                                    </View>

                                    <View style={styles.tableRow}>
                                        <Text style={styles.smallSubscriptName}>PREV BALANCE</Text>
                                        <Text style={styles.smallSubscriptNumber}>{parseFloat(data.orderPreBalance).toFixed(2)}</Text>
                                    </View>

                                    <View style={styles.tableRow}>
                                        <Text style={styles.subscriptName}>ALL TOTAL</Text>
                                        <Text style={styles.subscriptNumber}>{renderTotalNumber(data)}</Text>
                                    </View>

                                    <View style={styles.tableRow}>
                                        <Text style={styles.totalDue}>ALL TOTAL DUE</Text>
                                        <Text style={styles.totalDueNumber}>AUD {renderTotalNumber(data)}</Text>
                                    </View>

                                    <View style={styles.tableRow}>
                                        <Text style={styles.subscriptName}></Text>
                                        <Text style={styles.thankYou}>Thank you.</Text>
                                    </View>
                                </View>
                            </View> :
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 0.5 }}>
                                    <View style={{ ...styles.middleRow, padding: 5 }}>
                                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>Note</Text>
                                        <Text> {data.orderNote} </Text>
                                    </View>
                                </View>

                                <View style={{ flex: 0.5 }}>
                                    <View style={styles.tableRow}>
                                        <Text style={styles.subscriptName}></Text>
                                        <Text style={styles.thankYou}>Thank you.</Text>
                                    </View>
                                </View>
                            </View>
                    }
                </View>
            </View>
            {/* Footer Section */}
            <View style={styles.footer}>
                <View style={styles.topFooter}>
                    <View style={styles.leftTopFooter}>
                        <Text>Sign:</Text>
                    </View>
                    <View style={styles.rightTopFooter}>
                        <Text>Prepare by:</Text>
                    </View>
                </View>

                {!data.isCashSale && showPrice && (
                    <View>
                        <Text>Thanks for your payment via EFT to:</Text>
                        <Text>Pioneer Aluminium Pty Ltd</Text>
                        <Text>BSB: 063 779   Account No: 1032 0767</Text>
                    </View>
                )}

                <View style={styles.claims}>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                        NO CLAIMS RECOGNISED UNLESS MADE WITHIN 7 DAYS
                    </Text>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                        OF RECEIPT OF GOODS
                    </Text>
                </View>
            </View>

        </Page>
    </Document>
);

export default MyDocument;