import type {Metadata} from "next";
import {ShowcaseClient} from "./ShowcaseClient";
export const metadata:Metadata={title:"EVENTER — создайте своё событие",description:"Идеи, готовые решения и профессионалы для событий любого формата."};
export default function DiscoverPage(){return <ShowcaseClient/>}
