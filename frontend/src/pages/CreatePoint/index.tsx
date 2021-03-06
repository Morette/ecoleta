import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import DropZone from '../DropZone';
import api from '../../services/api';

import { FiArrowLeft } from 'react-icons/fi';

import logo from '../../assets/logo.svg';
import './styles.css';
import axios from 'axios';

interface ItemProps {
	id: number;
	title: string;
	image_url: string;
}

interface IBGEUFResponse {
	sigla: string;
}

interface IBGECityResponse {
	nome: string;
}

const CreatePoint = () => {
	const history = useHistory();

	const [items, setItems] = useState<ItemProps[]>([]);
	const [ufs, setUfs] = useState<string[]>([]);
	const [selectedUF, setSelectedUF] = useState('0');
	const [selectedCity, setSelectedCity] = useState('0');
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [selectedFile, setSelectedFile] = useState<File>();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		whatsapp: '',
	});
	const [initialPosition, setInitialPosition] = useState<[number, number]>([
		0,
		0,
	]);
	const [makerPosition, setMarkerPosition] = useState<[number, number]>([
		0,
		0,
	]);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {
			const { latitude, longitude } = position.coords;

			setInitialPosition([latitude, longitude]);
		});
	}, []);

	useEffect(() => {
		api.get('/items').then(response => setItems(response.data));
	}, []);

	useEffect(() => {
		axios
			.get<IBGEUFResponse[]>(
				'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
			)
			.then(response => {
				const UFInitials = response.data.map(uf => uf.sigla);
				setUfs(UFInitials);
			});
	}, []);

	useEffect(() => {
		axios
			.get<IBGECityResponse[]>(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`,
			)
			.then(response => {
				const cityNames = response.data.map(uf => uf.nome);
				setCities(cityNames);
			});
	}, [selectedUF]);

	const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
		const uf = event.target.value;
		setSelectedUF(uf);
	};

	const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
		const city = event.target.value;
		setSelectedCity(city);
	};

	const handleMapClick = (event: LeafletMouseEvent) => {
		setMarkerPosition([event.latlng.lat, event.latlng.lng]);
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
	};

	const handleSelectItem = (id: number) => {
		selectedItems.findIndex(item => item === id) >= 0
			? setSelectedItems(selectedItems.filter(item => item !== id))
			: setSelectedItems([...selectedItems, id]);
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		const { name, email, whatsapp } = formData;
		const uf = selectedUF;
		const city = selectedCity;
		const [latitude, longitude] = makerPosition;
		const items = selectedItems;

		const data = new FormData();

		data.append('name', name);
		data.append('email', email);
		data.append('whatsapp', whatsapp);
		data.append('uf', uf);
		data.append('city', city);
		data.append('latitude', String(latitude));
		data.append('longitude', String(longitude));
		data.append('items', items.join(','));

		if (selectedFile) {
			data.append('image', selectedFile);
		}

		await api.post('points', data);
		history.push('/');
	};

	return (
		<div id='page-create-point'>
			<header>
				<img src={logo} alt='Ecoleta' />

				<Link to='/'>
					<FiArrowLeft />
					Voltar para Home
				</Link>
			</header>

			<form onSubmit={handleSubmit}>
				<h1>
					Cadastro do
					<br /> ponto de coleta
				</h1>

				<DropZone onFileUpload={setSelectedFile} />

				<fieldset>
					<legend>
						<h2>Dados</h2>
					</legend>

					<div className='field'>
						<label htmlFor='name'>Nome da entidade</label>
						<input
							type='text'
							name='name'
							id='name'
							onChange={handleInputChange}
						/>
					</div>

					<div className='field-group'>
						<div className='field'>
							<label htmlFor='email'>Email</label>
							<input
								type='email'
								name='email'
								id='email'
								onChange={handleInputChange}
							/>
						</div>
						<div className='field'>
							<label htmlFor='whatsapp'>Whatsapp</label>
							<input
								type='text'
								name='whatsapp'
								id='whatsapp'
								onChange={handleInputChange}
							/>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Endereço</h2>
						<span>Selecione o endereço no mapa</span>
					</legend>

					<Map center={initialPosition} zoom={15} onClick={handleMapClick}>
						<TileLayer
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						/>

						<Marker position={makerPosition} />
					</Map>

					<div className='field-group'>
						<div className='field'>
							<label htmlFor='uf'>Estado (UF)</label>
							<select
								name='uf'
								id='uf'
								value={selectedUF}
								onChange={handleSelectUf}
							>
								<option value='0'>Selecione UF</option>
								{ufs.map(uf => (
									<option key={uf} value={uf}>
										{uf}
									</option>
								))}
							</select>
						</div>

						<div className='field'>
							<label htmlFor='city'>Cidade</label>
							<select
								name='city'
								id='city'
								value={selectedCity}
								onChange={handleSelectCity}
							>
								<option value='0'>Selecione uma cidade</option>
								{cities.map(city => (
									<option key={city} value={city}>
										{city}
									</option>
								))}
							</select>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Itens de Coleta</h2>
						<span>Selecione um ou mais itens abaixo</span>
					</legend>

					<ul className='items-grid'>
						{items.map(item => (
							<li
								key={item.id}
								className={
									selectedItems.includes(item.id) ? 'selected' : ''
								}
								onClick={() => handleSelectItem(item.id)}
							>
								<img src={item.image_url} alt={item.title} />
								<span>{item.title}</span>
							</li>
						))}
					</ul>
				</fieldset>

				<button type='submit'>Cadastrar ponto de coleta</button>
			</form>
		</div>
	);
};

export default CreatePoint;
