import { Card, Row, Col } from "antd";
import { TeamOutlined } from "@ant-design/icons";

const StatisticCard = ({ data, spanNumber = 8 }) => {
	return (
		<Card
			bordered={false}
			style={{ height: "auto" }}
			title={
				<Row>
					<Col span={2}>
						<TeamOutlined />
					</Col>
					<Col span={18}>Customers Summary</Col>
				</Row>
			}
		>
			<Row gutter={[16, 16]}>
				{data.map((d, index) => {
					return (
						<Col key={index} span={spanNumber}>
							<span style={{ fontSize: "15px" }}>{d.title}</span>
							<br />
							<span style={{ fontSize: "20px", ...d.style }}>
								{d.number}
							</span>
						</Col>
					);
				})}
			</Row>
		</Card>
	);
};

export default StatisticCard;
