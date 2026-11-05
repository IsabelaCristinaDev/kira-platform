// Mapa chave da tela → componente (as URLs ficam em routes.js) · API: nenhuma
import ClientAccountSecurityScreen from "./client/screens/ClientAccountSecurityScreen";
import ClientAddressScreen from "./client/screens/ClientAddressScreen";
import ClientAgendaDetailScreen from "./client/screens/ClientAgendaDetailScreen";
import ClientRescheduleScreen from "./client/screens/ClientRescheduleScreen";
import ClientConversationScreen from "./client/screens/ClientConversationScreen";
import ClientAgendaScreen from "./client/screens/ClientAgendaScreen";
import ClientBookingTrackingScreen from "./client/screens/ClientBookingTrackingScreen";
import ClientCheckoutScreen from "./client/screens/ClientCheckoutScreen";
import ClientJourneyScreen from "./client/screens/ClientJourneyScreen";
import ClientLoyaltyScreen from "./client/screens/ClientLoyaltyScreen";
import ClientPaymentProcessingScreen from "./client/screens/ClientPaymentProcessingScreen";
import ClientRecommendedScreen from "./client/screens/ClientRecommendedScreen";
import ProClientsScreen from "./professional/screens/ProClientsScreen";
import ClientChatScreen from "./client/screens/ClientChatScreen";
import ClientConversationsScreen from "./client/screens/ClientConversationsScreen";
import ClientFaqScreen from "./client/screens/ClientFaqScreen";
import ClientNotificationsScreen from "./client/screens/ClientNotificationsScreen";
import ClientCouponsScreen from "./client/screens/ClientCouponsScreen";
import ClientDocumentScreen from "./client/screens/ClientDocumentScreen";
import ClientDoneScreen from "./client/screens/ClientDoneScreen";
import ClientFavoritesScreen from "./client/screens/ClientFavoritesScreen";
import ClientHelpSupportScreen from "./client/screens/ClientHelpSupportScreen";
import ClientHistoryScreen from "./client/screens/ClientHistoryScreen";
import ClientHomeScreen from "./client/screens/ClientHomeScreen";
import ClientLgpdConsentsScreen from "./client/screens/ClientLgpdConsentsScreen";
import ClientLocationScreen from "./client/screens/ClientLocationScreen";
import ClientPaymentHistoryScreen from "./client/screens/ClientPaymentHistoryScreen";
import ClientPaymentMethodsScreen from "./client/screens/ClientPaymentMethodsScreen";
import ClientPersonalScreen from "./client/screens/ClientPersonalScreen";
import ClientPreferencesScreen from "./client/screens/ClientPreferencesScreen";
import ClientPrivacyDataScreen from "./client/screens/ClientPrivacyDataScreen";
import ClientProfessionalProfileScreen from "./client/screens/ClientProfessionalProfileScreen";
import ClientProfileEditScreen from "./client/screens/ClientProfileEditScreen";
import ClientProfileScreen from "./client/screens/ClientProfileScreen";
import ClientReviewsScreen from "./client/screens/ClientReviewsScreen";
import ClientSchedulingScreen from "./client/screens/ClientSchedulingScreen";
import ClientSearchScreen from "./client/screens/ClientSearchScreen";
import ClientSelfieScreen from "./client/screens/ClientSelfieScreen";
import ClientTermsScreen from "./client/screens/ClientTermsScreen";
import ClientTryOnPhotoScreen from "./client/screens/ClientTryOnPhotoScreen";
import ClientTryOnReferenceScreen from "./client/screens/ClientTryOnReferenceScreen";
import ClientTryOnResultScreen from "./client/screens/ClientTryOnResultScreen";
import ProAddressScreen from "./professional/screens/ProAddressScreen";
import ProAgendaDashScreen from "./professional/screens/ProAgendaDashScreen";
import ProRescheduleScreen from "./professional/screens/ProRescheduleScreen";
import ProConversationScreen from "./professional/screens/ProConversationScreen";
import ProAnalyticsScreen from "./professional/screens/ProAnalyticsScreen";
import ProDocumentScreen from "./professional/screens/ProDocumentScreen";
import ProDoneScreen from "./professional/screens/ProDoneScreen";
import ProFinanceScreen from "./professional/screens/ProFinanceScreen";
import ProGiftCardsScreen from "./professional/screens/ProGiftCardsScreen";
import ProBusinessHoursScreen from "./professional/screens/ProBusinessHoursScreen";
import ProHelpScreen from "./professional/screens/ProHelpScreen";
import ProHomeScreen from "./professional/screens/ProHomeScreen";
import ProLocationScreen from "./professional/screens/ProLocationScreen";
import ProLoyaltyScreen from "./professional/screens/ProLoyaltyScreen";
import ProPersonalScreen from "./professional/screens/ProPersonalScreen";
import ProPhotosScreen from "./professional/screens/ProPhotosScreen";
import ProConversationsScreen from "./professional/screens/ProConversationsScreen";
import ProFaqScreen from "./professional/screens/ProFaqScreen";
import ProNotificationsScreen from "./professional/screens/ProNotificationsScreen";
import ProPremiumScreen from "./professional/screens/ProPremiumScreen";
import { ProSearchScreen } from "./professional/screens/ProSearchScreen";
import ProProfileMenuScreen from "./professional/screens/ProProfileMenuScreen";
import ProSecurityScreen from "./professional/screens/ProSecurityScreen";
import ProServicesScreen from "./professional/screens/ProServicesScreen";
import ProSpecialtiesScreen from "./professional/screens/ProSpecialtiesScreen";
import ProTermsScreen from "./professional/screens/ProTermsScreen";
import FaceScreen from "./shared/screens/FaceScreen";
import HomeScreen from "./shared/screens/HomeScreen";
import ForgotPasswordScreen from "./shared/screens/ForgotPasswordScreen";
import LoginScreen from "./shared/screens/LoginScreen";
import OpenConversationScreen from "./shared/screens/OpenConversationScreen";
import ResetPasswordScreen from "./shared/screens/ResetPasswordScreen";
import SignupScreen from "./shared/screens/SignupScreen";
import SplashScreen from "./shared/screens/SplashScreen";

// Mapa `screen` -> tela. A navegação usa as rotas de routes.js e AppRoutes.jsx.
export const screens = {
  splash: SplashScreen,
  login: LoginScreen,
  openConversation: OpenConversationScreen,
  forgotPassword: ForgotPasswordScreen,
  resetPassword: ResetPasswordScreen,
  signup: SignupScreen,
  clientPersonal: ClientPersonalScreen,
  clientAddress: ClientAddressScreen,
  clientLocation: ClientLocationScreen,
  clientDocument: ClientDocumentScreen,
  clientSelfie: ClientSelfieScreen,
  clientTerms: ClientTermsScreen,
  clientDone: ClientDoneScreen,
  clientPreferences: ClientPreferencesScreen,
  clientHome: ClientHomeScreen,
  clientSearch: ClientSearchScreen,
  clientTryOnReference: ClientTryOnReferenceScreen,
  clientTryOnPhoto: ClientTryOnPhotoScreen,
  clientTryOnResult: ClientTryOnResultScreen,
  clientAgenda: ClientAgendaScreen,
  clientAgendaDetail: ClientAgendaDetailScreen,
  clientReschedule: ClientRescheduleScreen,
  clientConversation: ClientConversationScreen,
  clientBookingTracking: ClientBookingTrackingScreen,
  clientProfile: ClientProfileScreen,
  clientProfileEdit: ClientProfileEditScreen,
  clientAccountSecurity: ClientAccountSecurityScreen,
  clientPrivacyData: ClientPrivacyDataScreen,
  clientLgpdConsents: ClientLgpdConsentsScreen,
  clientPaymentMethods: ClientPaymentMethodsScreen,
  clientPaymentHistory: ClientPaymentHistoryScreen,
  clientCoupons: ClientCouponsScreen,
  clientHelpSupport: ClientHelpSupportScreen,
  clientFaq: ClientFaqScreen,
  clientCheckout: ClientCheckoutScreen,
  clientPaymentProcessing: ClientPaymentProcessingScreen,
  clientRecommended: ClientRecommendedScreen,
  clientLoyalty: ClientLoyaltyScreen,
  clientJourney: ClientJourneyScreen,
  clientConversations: ClientConversationsScreen,
  clientNotifications: ClientNotificationsScreen,
  clientChat: ClientChatScreen,
  clientReviews: ClientReviewsScreen,
  clientFavorites: ClientFavoritesScreen,
  clientHistory: ClientHistoryScreen,
  clientProfessionalProfile: ClientProfessionalProfileScreen,
  clientScheduling: ClientSchedulingScreen,
  proPersonal: ProPersonalScreen,
  proAddress: ProAddressScreen,
  proLocation: ProLocationScreen,
  proSpecialties: ProSpecialtiesScreen,
  proServices: ProServicesScreen,
  proPhotos: ProPhotosScreen,
  proDocument: ProDocumentScreen,
  proTerms: ProTermsScreen,
  proDone: ProDoneScreen,
  proHome: ProHomeScreen,
  proAgendaDash: ProAgendaDashScreen,
  proReschedule: ProRescheduleScreen,
  proConversation: ProConversationScreen,
  proProfileMenu: ProProfileMenuScreen,
  proFinance: ProFinanceScreen,
  proAnalytics: ProAnalyticsScreen,
  proGiftCards: ProGiftCardsScreen,
  proLoyalty: ProLoyaltyScreen,
  proSecurity: ProSecurityScreen,
  proBusinessHours: ProBusinessHoursScreen,
  proHelp: ProHelpScreen,
  proFaq: ProFaqScreen,
  proClients: ProClientsScreen,
  proConversations: ProConversationsScreen,
  proNotifications: ProNotificationsScreen,
  proPremium: ProPremiumScreen,
  proSearch: ProSearchScreen,
  face: FaceScreen,
  home: HomeScreen,
};
