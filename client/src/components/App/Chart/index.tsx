import React, {Fragment, useEffect, useState} from "react";
import {NewsType} from "../interface";
import Chart from "./Chart";
import {getChartData} from "../../../utils/tools";

export default (props: {news: NewsType[], isLoading: boolean}) => {

    const [hasData, setHasData] = useState<boolean>(false);
    const [chartData, setChartData] = useState<{y: number, x: string}[]>([]);

    useEffect(() => {
        setHasData(false);
    }, [props.isLoading]);

    useEffect(() => {
        const datums = getChartData(props.news);
        const dataExist = datums.find(item => item.y !== 0);
        if (dataExist && !hasData) {
            setChartData([]);
            setTimeout(() => {
                setChartData(datums);
            });
            setHasData(true);
        }
        else {
            setChartData(datums);
        }
    }, [props.news]);
    return (
        <div className="chart-section">
            {!props.isLoading
            ? <Fragment>
                    <div className={'app-chart'}>
                        <h2 className={'votes'}>Votes</h2>
                        {
                            chartData.length ? <Chart datums={chartData} /> : null
                        }
                    </div>
                    <h2>ID</h2>
                </Fragment>
            : ''}
        </div>
    );
};