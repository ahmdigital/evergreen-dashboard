import DependenciesContainer from  "../components/DependenciesContainer";
import cachedData from "../cachedData.json";
import {JSObjectFromJSON} from "../components/dataProcessing";

export default function TestPage() {
    
    const JSObject = JSObjectFromJSON(cachedData.npm as [any, {dep: number, dependencies: (string | number)[][]}[]] | never[])
    
    return <DependenciesContainer JSObject={JSObject}/>
        
}