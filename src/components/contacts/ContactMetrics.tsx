import { Card, Typography } from "@mui/material";
import { PeopleOutlined, TrendingUp, CheckCircleOutlined, Bolt } from "@mui/icons-material";
import { money } from "@/lib/format";
type Props = { count: number; customers: number; totalValue: number; loading: boolean };
export default function ContactMetrics({ count, customers, totalValue, loading }: Props) {
const metrics = [
  { label: "TOTAL LEADS", value: count, caption: "Active database records", color: "#f5f7ff", icon: <PeopleOutlined /> },
  { label: "PIPELINE DEAL VALUE", value: money(totalValue), caption: "Total estimated value", color: "#2bd4a3", icon: <TrendingUp /> },
  { label: "CONVERTED CUSTOMERS", value: customers, caption: "Successfully closed", color: "#8c87ff", icon: <CheckCircleOutlined /> },
  { label: "CONVERSION RATE", value: `${count ? (customers / count * 100).toFixed(1) : "0.0"}%`, caption: "Lead to customer ratio", color: "#19cee9", icon: <Bolt /> }
 ];
return (<section className="metrics" aria-label="Dashboard summary">{metrics.map(metric => <Card key={metric.label} className="metric" variant="outlined"><div className="metric-top"><Typography className="metric-label">{metric.label}</Typography><span className="metric-icon" style={{ color: metric.color }}>{metric.icon}</span></div><Typography className="metric-value" style={{ color: metric.color }}>{loading ? "--" : metric.value}</Typography><Typography className="metric-caption">{metric.caption}</Typography></Card>)}</section>);
}
