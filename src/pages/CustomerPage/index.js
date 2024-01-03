import React, { useEffect, useState } from "react";
import "./index.scss";

import {
	Button,
	Breadcrumb,
	Layout,
	Row,
	Col,
	Modal,
	Form,
	Input,
	Select,
	Switch,
	message,
	Flex,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addCustomer, customersSummary } from "../../api/api.js";
import StatisticCard from "@/components/StatisticCard/StatisticCard";
import List from "./components/List";

const CustomerPage = () => {
	const { Content } = Layout;
	const { Option } = Select;
	const [messageApi, contextHolder] = message.useMessage();
	const [form] = Form.useForm();

	const [customerNo, setCustomerNo] = useState([]);

	const [visible, setVisible] = useState(false);
	const [addLoading, setAddLoading] = useState(false);
	const showModel = () => {
		setVisible(true);
	};

	const handleOk = async () => {
		form.validateFields()
			.then(async (values) => {
				setAddLoading(true);

				try {
					const posts = await addCustomer(values);
					if (posts.code === 200) {
						setVisible(false);
						form.resetFields();
						window.location.reload();
					} else {
						messageApi.open({
							type: "error",
							content: "Add New Customer Error!",
						});
					}
				} catch (error) {
					console.log(error);
					messageApi.open({
						type: "error",
						content: "Add New Customer Error!",
					});
				}
			})
			.catch((errorInfo) => {
				messageApi.open({
					type: "error",
					content: "Please fill in the required fields!",
				});
			})
			.finally(() => {
				setAddLoading(false);
			});
	};

	const handleCancel = () => {
		setVisible(false);
		setAddLoading(false);
		form.resetFields();
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await customersSummary();
				if (res.code === 200) {
					setCustomerNo([
						{
							title: "All Customers",
							number: res.data.total,
						},
						{
							title: "Active",
							number: res.data.active,
						},
						{
							title: "In-Active",
							number: res.data.inactive,
							style: { color: "red" },
						},
					]);
				} else {
					messageApi.open({
						type: "error",
						content: "Loading Customers Summary Error!",
					});
				}
			} catch (error) {
				console.log(error);
				messageApi.open({
					type: "error",
					content: "Loading Customers Summary Error!",
				});
			}
		};

		fetchData();
	}, [messageApi]);

	// TODO: fetch data from api
	const customerSummary = [
		{
			title: "New Customers",
			number: "100",
		},
		{
			title: "Orders",
			number: "999",
		},
	];

	return (
		<div className="ivt-layout">
			<Layout>
				{contextHolder}
				<Content style={{ margin: "10px" }}>
					<div className="customer-container ">
						<Breadcrumb
							separator=">"
							items={[
								{
									title: "Home",
									href: "/",
								},
								{
									title: "Customers",
									href: "",
								},
							]}
						/>

						<Flex align="flex-end" justify="flex-end">
							<Button
								type="primary"
								icon={<PlusOutlined />}
								size="large"
								onClick={showModel}
								className="new-customer-button"
							>
								New Customer
							</Button>
						</Flex>

						<Modal
							title="Add a New Customer"
							open={visible}
							onOk={handleOk}
							onCancel={handleCancel}
							maskClosable={false}
							width={600}
							centered
							footer={[
								<Button
									key="back"
									onClick={handleCancel}
									style={{
										display: "inline-block",
										width: "calc(50% - 12px)",
									}}
									size="large"
								>
									Cancel
								</Button>,
								<Button
									key="submit"
									type="primary"
									loading={addLoading}
									onClick={handleOk}
									style={{
										display: "inline-block",
										width: "calc(50% - 12px)",
										margin: "0 12px",
									}}
									size="large"
								>
									Add
								</Button>,
							]}
						>
							<span
								style={{
									fontSize: "14px",
									fontWeight: "normal",
								}}
							>
								Customer Information
							</span>

							<Form
								form={form}
								name="customerForm"
								style={{
									maxWidth: 500,
									marginLeft: "auto",
									marginRight: "auto",
									marginTop: "20px",
									marginBottom: "60px",
								}}
							>
								<Form.Item
									name="companyName"
									rules={[
										{
											required: true,
											message:
												"Please enter the company name",
										},
									]}
								>
									<Input
										placeholder="* Company Name"
										className="form-item"
									/>
								</Form.Item>

								<Form.Item name="customerName">
									<Input
										placeholder="Customer Name"
										className="form-item"
									/>
								</Form.Item>

								<Form.Item
									name="customerEmail"
									rules={[
										{
											type: "email",
											message: "Invalid email format",
										},
									]}
								>
									<Input
										placeholder="Email"
										className="form-item"
									/>
								</Form.Item>

								<Form.Item name="customerPhone">
									<Input
										placeholder="Phone Number"
										className="form-item"
									/>
								</Form.Item>

								<Form.Item
									name="creditTerm"
									rules={[
										{
											required: true,
											message:
												"Please select credit term!",
										},
									]}
								>
									<Select
										placeholder="* Credit Term"
										className="form-item"
									>
										<Option value="immidiately">
											Immediately
										</Option>
										<Option value="30 days">30 days</Option>
										<Option value="60 days">60 days</Option>
									</Select>
								</Form.Item>

								<Form.Item name="note">
									<Input.TextArea
										placeholder="Note"
										style={{ height: "150px" }}
									/>
								</Form.Item>

								<Form.Item
									label="Add Delivery Address"
									name="enableAddress"
									valuePropName="checked"
									labelCol={{ span: 7 }}
									wrapperCol={{ span: 2, offset: 14 }}
								>
									<Switch />
								</Form.Item>

								<Form.Item
									noStyle
									shouldUpdate={(prevValues, currentValues) =>
										prevValues.enableAddress !==
										currentValues.enableAddress
									}
								>
									{({ getFieldValue }) => {
										const enableAddress =
											getFieldValue("enableAddress");

										return enableAddress ? (
											<>
												<Form.Item name="customerDeliveryAddress">
													<Input
														placeholder="Delivery Address"
														className="form-item"
													/>
												</Form.Item>

												<Form.Item
													label="Billing Address Same as Delivery Address"
													name="enableBilling"
													valuePropName="checked"
													initialValue={true}
													labelCol={{ span: 13 }}
													wrapperCol={{
														span: 2,
														offset: 8,
													}}
												>
													<Switch />
												</Form.Item>

												<Form.Item
													noStyle
													shouldUpdate={(
														prevValues,
														currentValues
													) =>
														prevValues.enableBilling !==
														currentValues.enableBilling
													}
												>
													{({ getFieldValue }) => {
														const enableBilling =
															getFieldValue(
																"enableBilling"
															);

														return enableBilling ? (
															<></>
														) : (
															<Form.Item name="customerBillingAddress">
																<Input
																	placeholder="Billing Address"
																	className="form-item"
																/>
															</Form.Item>
														);
													}}
												</Form.Item>
											</>
										) : null;
									}}
								</Form.Item>
							</Form>
						</Modal>

						<Row gutter={[16, 16]}>
							<Col span={12}>
								<StatisticCard data={customerNo} />
							</Col>
							<Col span={12}>
								<StatisticCard
									data={customerSummary}
									spanNumber={12}
								/>
							</Col>
						</Row>
						<List />
					</div>
				</Content>
			</Layout>
		</div>
	);
};

export default CustomerPage;
