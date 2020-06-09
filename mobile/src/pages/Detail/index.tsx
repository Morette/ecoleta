import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	SafeAreaView,
	Linking,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

interface Params {
	point_id: number;
}

interface PointData {
	point: {
		image: string;
		name: string;
		email: string;
		whatsapp: string;
		city: string;
		uf: string;
	};
	items: [
		{
			title: string;
		},
	];
}

const Detail = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const [pointData, setPointData] = useState<PointData>({} as PointData);

	const routeParams = route.params as Params;

	const handleNavigateBack = () => {
		navigation.goBack();
	};

	useEffect(() => {
		api.get(`points/${routeParams.point_id}`).then(response =>
			setPointData(response.data),
		);
	}, []);

	const handleComposeMail = () => {
		MailComposer.composeAsync({
			subject: 'Interesse na coleta de resíduos',
			recipients: [pointData.point.email],
		});
	};

	const handleWhatsApp = () => {
		Linking.openURL(
			`whatsapp://send?phone=${pointData.point.whatsapp}&text=Tenho interesse na coleta de resíduos`,
		);
	};

	if (!pointData.point) {
		return null;
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleNavigateBack}>
					<Feather name='arrow-left' size={20} color='#34cb79' />
				</TouchableOpacity>

				<Image
					style={styles.pointImage}
					source={{
						uri: `${pointData.point.image}`,
					}}
				/>
				<Text style={styles.pointName}>{pointData.point.name}</Text>
				<Text style={styles.pointItems}>
					{pointData.items.map(item => item.title).join(', ')}
				</Text>

				<View style={styles.address}>
					<Text style={styles.addressTitle}>Endereço</Text>
					<Text style={styles.addressContent}>
						{pointData.point.city}, {pointData.point.uf}
					</Text>
				</View>
			</View>

			<View style={styles.footer}>
				<RectButton style={styles.button} onPress={handleWhatsApp}>
					<FontAwesome name='whatsapp' size={20} color='#fff' />
					<Text style={styles.buttonText}>Whatsapp</Text>
				</RectButton>

				<RectButton style={styles.button} onPress={handleComposeMail}>
					<Feather name='mail' size={20} color='#fff' />
					<Text style={styles.buttonText}>Email</Text>
				</RectButton>
			</View>
		</SafeAreaView>
	);
};

export default Detail;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 32,
		paddingTop: 20,
	},

	pointImage: {
		width: '100%',
		height: 120,
		resizeMode: 'cover',
		borderRadius: 10,
		marginTop: 32,
	},

	pointName: {
		color: '#322153',
		fontSize: 28,
		fontFamily: 'Ubuntu_700Bold',
		marginTop: 24,
	},

	pointItems: {
		fontFamily: 'Roboto_400Regular',
		fontSize: 16,
		lineHeight: 24,
		marginTop: 8,
		color: '#6C6C80',
	},

	address: {
		marginTop: 32,
	},

	addressTitle: {
		color: '#322153',
		fontFamily: 'Roboto_500Medium',
		fontSize: 16,
	},

	addressContent: {
		fontFamily: 'Roboto_400Regular',
		lineHeight: 24,
		marginTop: 8,
		color: '#6C6C80',
	},

	footer: {
		borderTopWidth: StyleSheet.hairlineWidth,
		borderColor: '#999',
		paddingVertical: 20,
		paddingHorizontal: 32,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	button: {
		width: '48%',
		backgroundColor: '#34CB79',
		borderRadius: 10,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	buttonText: {
		marginLeft: 8,
		color: '#FFF',
		fontSize: 16,
		fontFamily: 'Roboto_500Medium',
	},
});
