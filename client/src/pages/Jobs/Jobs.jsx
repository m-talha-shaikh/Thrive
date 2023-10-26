
import "./Jobs.scss"
import { useForm } from 'react-hook-form'


const Jobs =()=>
{

    const form = useForm();
    const { register } = form;
    
    return (
        <div>
            <form>
                <input type="text" id="keyword" {...register("keyword")} />

                <input type="text" id="country" {...register("country")} />

            </form>
        </div>
    )
}


export default Jobs;