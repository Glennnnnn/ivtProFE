import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from "moment";


// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FDFDFD',
        padding: 20
    },
    header: {
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    leftHeader: {
        fontSize: 11,
        color: 'black',
        lineHeight: 1.5,
    },
    rightHeader: {
        fontSize: 18,
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
    topCenter: {
        flex: 1,
        fontSize: 11,
        color: 'black',
        lineHeight: 1.5,
    },
    topRight: {
        flex: 2,
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
    subscriptName: {
        flex: 0.3,
        color: '#5F9EA0',
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        lineHeight: 1.5,
    },
    subscriptNumber: {
        flex: 0.15,
        color: 'black',
        fontSize: 11,
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
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        marginBottom: 5,
    },
    tableHeaderCell: {
        flex: 1,
        fontSize: 11,
        textAlign: 'center',
    },
    itemCodeCell: {
        flex: 0.15,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
        alignItems: 'center',
    },
    descriptionCell: {
        flex: 0.4,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
    },
    qtyCell: {
        flex: 0.15,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
    },
    rateCell: {
        flex: 0.15,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
    },
    amountCell: {
        flex: 0.15,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
    },
    descriptionItemCell: {
        flex: 0.4,
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
        alignItems: 'center',
    },
    qtyItemCell: {
        flex: 0.15,
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
        alignItems: 'center',
    },
    rateItemCell: {
        flex: 0.15,
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
        alignItems: 'center',
    },
    amountItemCell: {
        flex: 0.15,
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 1.5,
        alignItems: 'center',
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
    },
    totalDue: {
        flex: 0.3,
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
        flex: 0.15,
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
        flex: 0.15,
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
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center', // Center-align the text
        fontSize: 12, // Set font size to 12
    },
});

const renderDate = (text) => {
    return moment(text).format('DD/MM/YYYY');
};

const renderDueDate = (data) => {
    const originalDate = moment(data.orderDate);

    if (data.customerInterPo === null || "immediately" === data.customerInterPo?.creditTerm || data.customerInterPo === undefined) {
        return originalDate.format('DD/MM/YYYY');
    } else if (data.customerInterPo.creditTerm.includes("30")) {
        return originalDate.add(30, 'day').format('DD/MM/YYYY');
    } else if (data.customerInterPo.creditTerm.includes("60")) {
        return originalDate.add(30, 'day').format('DD/MM/YYYY');
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

// Create Document Component
const MyDocument = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.leftHeader}>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>Pioneer Aluminium Pty Ltd</Text>
                    <Text>70 North View Drive</Text>
                    <Text>Sunshine West VIC  3020</Text>
                    <Text>info@pioneertrading.com.au</Text>
                    <Text>ABN 69870739006</Text>
                </View>
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
                        <Text>{data.orderBillingAddress}</Text>
                    </View>
                    <View style={styles.topCenter}>
                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>Ship to</Text>
                        <Text>{data.orderDeliveryAddress}</Text>
                    </View>
                    <View style={styles.topRight}>
                        <View style={styles.lightBackground}>
                            <Text>DATE</Text>
                            <Text>{renderDate(data.orderDate)}</Text>
                        </View>
                        <View style={styles.darkBackground}>
                            <Text style={{ fontFamily: 'Helvetica-Bold' }}>PLEASE PAY</Text>
                            <Text>AUD {parseFloat(data.totalPrice).toFixed(2)}</Text>
                        </View>
                        <View style={styles.lightBackground}>
                            <Text>DUE DATE</Text>
                            <Text>{renderDueDate(data)}</Text>
                        </View>
                    </View>
                </View>

                {/* Middle Section */}
                <View style={styles.middleSection}>
                    <View style={styles.middleRow}>
                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>SHIP DATE</Text>
                        <Text> {renderDate(data.orderDate)} </Text>
                    </View>
                    <View style={styles.middleRow}>
                        <Text style={{ fontFamily: 'Helvetica-Bold' }}>TRACKING NO.</Text>
                        <Text> {data.orderId} </Text>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.itemCodeCell}>ITEM CODE</Text>
                        <Text style={styles.descriptionCell}>DESCRIPTION</Text>
                        <Text style={styles.qtyCell}>QTY</Text>
                        <Text style={styles.rateCell}>RATE</Text>
                        <Text style={styles.amountCell}>AMOUNT</Text>
                    </View>

                    {/* Table Body */}
                    {data.orderIvtPoList && data.orderIvtPoList.map((item, index) => (
                        <View key={index} style={styles.tableRowCell}>
                            <Text style={styles.itemCodeCell}>{item.ivtSubClassCode ?? ""}</Text>
                            <View style={styles.descriptionItemCell}>
                                <Text>{item.ivtClassName} {renderTags(item.tags)}</Text>
                            </View>
                            <Text style={styles.qtyItemCell}>{item.orderIvtQty}</Text>
                            <Text style={styles.rateItemCell}>{parseFloat(item.orderIvtPrice).toFixed(2)}</Text>
                            <Text style={styles.amountItemCell}>{parseFloat(item.orderIvtTotal).toFixed(2)}</Text>
                        </View>
                    ))}

                    {/* Subscript */}
                    <View style={styles.tableRow}>
                        <View style={styles.itemCodeCell}></View>
                        <View style={styles.descriptionItemCell}></View>
                        <Text style={styles.subscriptName}>SUBTOTAL</Text>
                        <Text style={styles.subscriptNumber}>{parseFloat(data.totalPrice).toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.itemCodeCell}></View>
                        <View style={styles.descriptionItemCell}></View>
                        <Text style={styles.subscriptName}>SHIPPING</Text>
                        <Text style={styles.subscriptNumber}>{parseFloat(data.orderShippingFee).toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.itemCodeCell}></View>
                        <View style={styles.descriptionItemCell}></View>
                        <Text style={styles.subscriptName}>TOTAL</Text>
                        <Text style={styles.subscriptNumber}>{(parseFloat(data.totalPrice) + parseFloat(data.orderShippingFee)).toFixed(2)}</Text>
                    </View>

                    {/* Total Due */}
                    <View style={styles.tableRow}>
                        <View style={styles.itemCodeCell}></View>
                        <View style={styles.descriptionItemCell}></View>
                        <Text style={styles.totalDue}>TOTAL DUE</Text>
                        <Text style={styles.totalDueNumber}>AUD {(parseFloat(data.totalPrice) + parseFloat(data.orderShippingFee)).toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.itemCodeCell}></View>
                        <View style={styles.descriptionItemCell}></View>
                        <Text style={styles.subscriptName}></Text>
                        <Text style={styles.thankYou}>Thank you.</Text>
                    </View>
                </View>
            </View>
            {/* Footer Section */}
            <View style={styles.footer}>
                <Text>Thanks for your payment via EFT to: </Text>
                <Text>Pioneer Aluminium Pty Ltd </Text>
                <Text>BSB: 063 779   Account No: 1032 0767 </Text>
            </View>
        </Page>
    </Document>
);

export default MyDocument;