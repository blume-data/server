import React from "react";
import ResizableBox from "./ResizableBox";
import "./styles.scss";
import {Chart} from 'react-charts/dist/react-charts.production.min';

export default function (datums) {
    return (
        <MyChart
            datums={datums.datums}
        />
    );
}

function MyChart({datums}) {

    const data = [{
        datums,
        label: 'up-votes'
    }];
    const axes = React.useMemo(
        () => [
            {
                primary: true,
                type: "ordinal",
                position: "bottom"
            },
            {
                type: "linear",
                position: "left",
                stacked: true
            }
        ],
        []
    );


    return (
        <ResizableBox>
            <Chart
                data={data}
                axes={axes}
            />
        </ResizableBox>
    );
}