import React, { useEffect } from 'react';
import { queryCashSaleOrderId } from "@/api/api.js";

const DashboardPage = () => {
    useEffect(() => {
        const fetchCashSaleOrderId = async () => {
            try {
                const gets = await queryCashSaleOrderId();
                console.log(gets);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchCashSaleOrderId();
    }, []);


    return (
        <div>
            <h2>Dashboard Content</h2>
            {/* Add your specific content for the Dashboard here */}
        </div>
    );
};

export default DashboardPage;