import ReactECharts from "echarts-for-react";


interface DataPoint {
    time: string;
    value: number;
}


interface Props {
    title: string;
    unit: string;
    data: DataPoint[];
}



export default function SensorLineChart({
    title,
    unit,
    data
}: Props) {


    const option = {

        title: {
            text: `${title} (${unit})`
        },


        tooltip: {
            trigger: "axis"
        },


        xAxis: {
            type: "category",
            data: data.map(
                item => item.time
            )
        },


        yAxis: {
            type: "value"
        },


        series: [
            {
                name: title,

                type: "line",

                smooth: true,

                data: data.map(
                    item => item.value
                ),

                showSymbol: false
            }
        ]
    };



    return (

        <div
            className="
                bg-white
                rounded-xl
                shadow
                p-4
            "
        >

            <ReactECharts
                option={option}
                style={{
                    height:400
                }}
            />

        </div>

    );

}