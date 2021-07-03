import React, {useEffect} from "react";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {randomString} from "../../../utils/tools";
import './index.scss';
import Accordion from "@material-ui/core/Accordion";

interface AccordianCommonProps {
    children: any;
    name: string;
    className?: string;
    shouldExpand?: boolean;
}

export const AccordianCommon = (props: AccordianCommonProps) => {
    const {children, name, shouldExpand=false, className=''} = props;
    const id = randomString();

    const [expanded, setExpanded] = React.useState<string | false>('');

    useEffect(() => {
        if(shouldExpand) {
            setExpanded('panel1');
        }
    }, [shouldExpand])

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Accordion
            className={`accordian-common-container ${className ? className : ''}`}
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${id}-content`}
                id={`${id}-header`}
            >
                <Typography>{name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
};
