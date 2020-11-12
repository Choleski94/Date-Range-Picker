import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import DateRangePicker from './DateRangePicker';
// import { fetchTransactionInfo } from './../../state/actions/transaction';
// import { filterTransactionDate } from './../../state/actions/transaction';

const fetchTransactionInfo = () => {}
const filterTransactionDate = () => {};

const evaluateFeePercent = (total = 100, fee = 0) => {
	return ((fee *100)/total).toPrecision(1);
};

const priceCorrection = (p = '', isHuman = true) => {
	const price = String(p), dotIndex = price.indexOf('.') + 1, decLength = price.length - dotIndex;
	return (
		((dotIndex > 0) && (dotIndex <= 2) && (decLength >= 3)) ? (
			(price[dotIndex - 2] === '0') ? (
				String(Number(price).toFixed(8))
			) : (
				String(Number(price).toFixed(2))
			)
		) : (
			(isHuman) ? (
				String(Number(price).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			) : (
				String(Number(price).toFixed(2))
			)
		)
	);
};

const formatTransactionPrice = (price, type) => {
	return (type.toLowerCase() === 'sell') ? Number(`-${price}`) : (price);
};

class App extends React.Component {

	state = {
		query 			: '',
		loading 		: false,
		options 		: [],
		transactions 		: [],
		transactionInfoClass 	: []
	};


	setFilteredData = (data) => {
		this.filteredData(data);
	};

	filterDate = (start, end) => {
		// this.props.filterTransactionDate(
		// 	start.format('DD-MM-YYYY'), 
		// 	end.format('DD-MM-YYYY')
		// );
	};

	handleClick = (id, i) => {

		const { options, transactionInfoClass } = this.state;
		let t = transactionInfoClass, o = options;

		if(typeof(options[i]) !== 'undefined'){
			t[i] = !t[i];
			this.setState({
				transactionInfoClass : t
			});
		}else{
			this.props.fetchTransactionInfo(id).then((info) => {
				o[i] = info;
				t[i] = true;
				this.setState({
					options 		: o,
					transactionInfoClass 	: t
				});
			});
		}
	};

	setStatus = (s) => {
		var r = '';
		if(s.toLowerCase() === 'pending'){
			r = `<span className="text-warning">${s}</span>`;
		}
		return r;
	};

	setFilteredData = (data) => {
		this.setState({
			'transactions' : data
		});
	};

	filterTransactionDate = (start, end) => {
		// redux
	};

	onSearchChange(e){
		e.preventDefault();
		clearTimeout(this.timer);
		this.setState({ query : e.target.value });
		this.timer = setTimeout(this.filterTransactions, 1000);
	};

	filterTransactions(){
		const query = this.state.query.toLowerCase();
		const { transactionList } = this.props;
		const transactionElts = [];

		if(!query){
			this.props.filteredTransactions(transactionList);
			return;
		}

		// Set loading state.
		this.setState({ loading : true });

		// Filter transaction.
		transactionList.filter((t, i) => {
			const searchStr = t['id'] + t['type']+ t['pair'] + t['status'] + t['amount'];
			const searchValue = (searchStr).toString().toLowerCase();
			if(searchValue.indexOf(query) !== -1){
				transactionElts.push(transactionList[i]);
			};
		});

		// Return objects.
		this.props.filteredTransactions(transactionElts);

		// Set loading state.
		this.setState({ loading : false });
	};

	renderFilterForm = () => {

		const { query, loading } = this.state;

		return (
			<form className="form" onSubmit={this.onSubmit}>
				<div className="input-group">
					<input type="text"
						className="form-control search"
						placeholder="Search for recent transaction"
						onChange={this.onSearchChange}
						value={query}
					/>
					<div className="input-group-prepend">
						<div className="input-group-text">
							{(loading) ? (
								<i className="fa ti-reload fa-spin" />
							) : (
								<i className="ti-search" />
							)}
						</div>
					</div>
				</div>
			</form>
		);
	}

	renderFilterSection = () => {

		const { transactions = [], transactionList = [] } = this.props; 
		
		// this.setFilteredData(transactionList);	// Set default data.
		const filterForm = this.renderFilterForm();

		return (
			<div className="transaction-activity-filter mb-2">
				<a className="btn btn-outline-primary d-inline-block d-md-none mb-1 collapsed" data-toggle="collapse" href="#filterOptions" role="button" aria-expanded="false" aria-controls="filterOptions">
					Filter <i className="fa fa-home align-middle"/>
				</a>
				<div className="d-inline-block d-md-none mb-1 collapsed float-right">
					<button type="button" className="btn btn-primary statement-btn" data-toggle="dropdown">
						<i className="ti-align-justify"/> Statement
					</button>
				</div>
				<div className="d-md-block collapse" id="filterOptions">
					<div className="d-md-flex">
						<div className="date-section">
							<DateRangePicker
								filterDate={this.filterDate} 
							/>
						</div>
						<div className="search-section">
							{filterForm}
						</div>
						<div className="statement-section">
							<div className="dropdown np-btn">
								<button type="button" className="btn btn-primary statement-btn" data-toggle="dropdown">
									<i className="ti-align-justify"/>
									<div className="font-10">Statement</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderTransactionDetail = (asset = []) => {
		return (
			<section className="transaction-details">
				<h6>Details</h6>
				<div className="table-responsive">
					<table className="table transaction-detail-table">
						<tbody>
							<tr>
								<td>
									Price
								</td>
								<td className="text-right text-muted text-uppercase">
									{priceCorrection(asset.price || 0)} {asset.quote || ''}
								</td>
							</tr>
							<tr>
								<td>
									Fee ({evaluateFeePercent(asset.price, asset.fee)}%)
								</td>
								<td className="text-right text-muted text-uppercase">
									{asset.fee || ''} {asset.quote || ''}
								</td>
							</tr>
							<tr>
								<td className="text-bold-800">
									Total
								</td>
								<td className="text-right text-muted text-uppercase">
									{priceCorrection(asset.total || 0)} {asset.quote || ''}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		);
	}

	renderTransactions = () => {

		const limited = false;
		const { options, transactionInfoClass } = this.state;
		const { transactions } = this.state;

		return (
			<div className={`card $(transactions.length > 0) && ('dotted')`}>
				<div className="card-body">
					<h4 className="card-title">
						Recent transactions
					</h4>
					{(transactions && transactions.length) ? (
						<div className="container container-scroll container-search container-transaction-fix">
							<ul className="wrapper transaction-list">
								{((!limited) ? (transactions) : (transactions.slice(0, 6))).map((record, i) => (
									<li key={`transaction-${i}`} className="transaction">
										<div className="transaction-container" onClick={() => this.handleClick(record.id, i)}>
											<div className="date">
												<span className="month">
													{moment.unix(record.datetime).format('MMM').replace('.', '')}
												</span>
												<span className="day">
													{moment.unix(record.datetime).format('D')}
												</span>
											</div>
											<h5 className="title">
												{record.pair}
											</h5>
											<h6 className="type">
												{record.type} - 
												<span className={`transaction-${record.status.toLowerCase()}`}>
													{` ${record.status}`}
												</span>
											</h6>
											<span className="amount">
												{priceCorrection(formatTransactionPrice(record.amount, record.type), false, false)}
												<span className="currency text-muted">
													{(record.pair.split('/')[0] || '').toUpperCase()}
												</span>
											</span>

										</div>	
										{(transactionInfoClass[i]) && (
											<div className="transaction-info">
												<hr className="divider-summary"/>
												<div className="transaction-summary">
													<div className="transaction-assets-details">
														<div className="row">
															<div className="col-md-6 col-sm-6 text-md-left text-sm-left">
																<h6>
																	Paid with
																</h6>
																<p>
																	Arbinuity Balance
																	<br/><br/>
																</p>
															</div>
															<div className="col-md-6 col-sm-6 text-md-right text-sm-right">
																<h6>
																	Transaction ID
																</h6>
																<p>{record.id}</p>
															</div>
														</div>
														<div className="row">
															<div className="col-md-6 col-sm-12 text-md-left">
																<div className="row">
																	<div className="col-md-12 col-sm-12 text-md-left transaction-exchange-rate">
																		<h6>
																			Exchange rate
																		</h6>
																		<p>
																			1 {options[i].base} = {priceCorrection(options[i].rate)} {options[i].quote} <br/>
																			{((options[i].amount > 1 ) || (options[i].amount < 1)) && (
																				<span>
																					{priceCorrection(options[i].amount)} {options[i].base} = {priceCorrection(options[i].price)} {options[i].quote}
																				</span>
																			)}
																		</p>
																	</div>
																</div>
																{(options[i].note) && (
																	<div className="row">
																		<div className="col-md-12 col-sm-12 text-md-left">
																			<h6>
																				Note
																			</h6>
																			<p>
																				{options[i].note}
																			</p>
																		</div>
																	</div>
																)}
															</div>
															{/*
															<div className="col-md-6 col-sm-12">
																{this.renderTransactionDetail(options[i])}
															</div>
															*/}
														</div>
													</div>
												</div>
											</div>
										)}
									</li>
								))}
							</ul>
						</div>
					) : (
						<h6 className="card-subtitle">
							You don't need a balance to shop or send money
						</h6>
					)}
				</div>
			</div>
		);
	}

	render(){

		const filterSection = this.renderFilterSection();
		const transactionsSection = this.renderTransactions();

		return (
			<main id="app-wrapper" dir="ltr">
				<section className="page-wrapper">
					<div className="container-fluid">
						<div className="row">
							<div className="col-md-12 col-sm-12">
								{filterSection}
							</div>
							<div className="col-md-12 col-sm-12">
								{transactionsSection}
							</div>
						</div>
					</div>
				</section>
			</main>
		);
	}

};

export default App;
