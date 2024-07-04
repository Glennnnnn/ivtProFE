import React, { useEffect, useState } from "react";

import { Card, Table, Row, Col, Input, message, Tag } from "antd";
import { customerList } from "@/api/api.js";
import { NavLink } from "react-router-dom";

const List = () => {
	const [loading, setLoading] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const [searchParams, setSearchParams] = useState({
		pagination: {
			current: 1,
			pageSize: 20,
			total: 0,
		},
	});
	const [searchName, setSearchName] = useState("");
	const [messageApi, contextHolder] = message.useMessage();

	const fetchDataAndUpdateState = async () => {
		try {
			setDataSource([]);
			setLoading(true);
			const posts = await customerList(searchParams);
			if (posts.code === 200) {
				setDataSource(posts.data.customerInterPos);
				setSearchParams({
					...searchParams,
					pagination: {
						...searchParams.pagination,
						total: posts.data.queryCount,
					},
				});
			} else {
				messageApi.open({
					type: "error",
					content: "Loading Customers Error!",
				});
			}
		} catch (error) {
			console.log(error);
			messageApi.open({
				type: "error",
				content: "Loading Customers Error!",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDataAndUpdateState();
	}, [JSON.stringify(searchParams)]);

	const handlePageChange = (pagination, filters, sorter) => {
		if (pagination.pageSize !== searchParams.pagination?.pageSize) {
			console.log("page size changed");
			pagination.current = 1;
			setDataSource([]);
		}

		setSearchParams({
			pagination,
			filters,
			...sorter,
		});
	};

	const onSearch = (value, _e) => {
		setSearchParams({
			...searchParams,
			pagination: {
				...searchParams.pagination,
				current: 1,
			},
			searchName: value,
		});
	};

	const onChange = (e) => {
		if (e.target.value !== searchName && loading === false) {
			setSearchParams({
				...searchParams,
				pagination: {
					...searchParams.pagination,
					current: 1,
				},
				searchName: e.target.value,
			});
			setSearchName(e.target.value);
		}
	};

	const columns = [
		{
			title: "Company Name",
			dataIndex: "companyName",
			width: 220,
			sorter: true,
			key: "customerId",
			render: (customerName, record) => {
				const url = `/customerDetails?customerId=${record.customerId}`;
				return (
					<NavLink
						to={url}
						state={{ customerDetails: JSON.stringify(record) }}
					>
						{customerName}
					</NavLink>
				);
			},
		},
		{
			title: "Customer Name",
			dataIndex: "customerName",
			width: 220,
		},
		{
			title: "Email",
			dataIndex: "customerEmail",
		},
		{
			title: "Phone",
			dataIndex: "customerPhone",
		},
		{
			title: "Orders",
			dataIndex: "orders",
		},
		{
			title: "Status",
			dataIndex: "delFlag",
			filters: [
				{ text: "active", value: "active" },
				{ text: "inactive", value: "inactive" },
			],
			render: (status) => (
				<span>
					<Tag color={status === "active" ? "green" : "volcano"}>
						{" "}
						{status}{" "}
					</Tag>
				</span>
			),
		},
	];

	return (
		<Card
			headStyle={{ height: "5%" }}
			bodyStyle={{ height: "85%", width: "100%" }}
		>
			<Row justify={"end"}>
				<Col>
					<Input.Search
						placeholder="Search Customer"
						onSearch={onSearch}
						enterButton
						style={{ width: 320, marginBottom: 20 }}
						onChange={onChange}
						value={searchName}
					/>
				</Col>
			</Row>
			<Table
				rowKey={"customerId"}
				columns={columns}
				dataSource={dataSource}
				pagination={searchParams.pagination}
				loading={loading}
				onChange={handlePageChange}
			/>
		</Card>
	);
};

export default List;
