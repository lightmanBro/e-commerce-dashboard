import './Featured.scss'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const Featured = ({ title, totalamount, desc, resultamount, salespercentage }) => {
    return (
        <div className="featured">
            <div className="top">
                <h1 className="title">{title}</h1>
                <MoreVertIcon />
            </div>
            <div className="bottom">
                <div className="featuredChart">
                    <CircularProgressbar value={salespercentage} text={`${salespercentage.toFixed(2)}%`} strokeWidth={2} />
                </div>
                <p className="title">Total Sales Made</p>
                <p className="amount">₦{totalamount}</p>
                <p className="desc">{desc}</p>
                <div className="summary">
                    <div className="item">
                        <div className="itemTitle">Target</div>
                        <div className={`itemResult ${salespercentage >= 100 ? 'positive' : 'negative'}`}>
                            {salespercentage >= 100 ? <KeyboardArrowUp fontSize='small' /> : <KeyboardArrowDown fontSize='small' />}
                            <div className="resultAmount">₦{resultamount}</div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">Last Week</div>
                        <div className="itemResult negative">
                            <KeyboardArrowUp fontSize='small' />
                            <div className="resultAmount">₦12.4k</div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">Last Month</div>
                        <div className="itemResult positive">
                            <KeyboardArrowDown fontSize='small' />
                            <div className="resultAmount">₦12.4k</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Featured
