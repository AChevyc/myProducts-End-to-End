﻿using Autofac;
using myProducts.Xamarin.Common.Locale;
using myProducts.Xamarin.Common.Locale.Languages;
using myProducts.Xamarin.Common.Networking;
using myProducts.Xamarin.Contracts.Networking;
using myProducts.Xamarin.Contracts.ViewModels;
using myProducts.Xamarin.ViewModels;
using myProducts.Xamarin.Views.Contracts;

namespace myProducts.Xamarin.Views.Pages
{
	public abstract class BaseViewLocator : IViewLocator
	{
		private IContainer _container;

		public BaseViewLocator()
		{
			BuildIoCContainer();
		}

		private void BuildIoCContainer()
		{
			var builder = new ContainerBuilder();

			WirePages(builder);
			WireViewModels(builder);
			WireLanguage(builder);
			WireServices(builder);
			WirePlatformDependentServices(builder);
			WireViewLocator(builder);

			_container = builder.Build();
		}

		private void WireViewLocator(ContainerBuilder builder)
		{
			builder.Register(context => this)
				.As<IViewLocator>()
				.SingleInstance();
		}

		private void WireViewModels(ContainerBuilder builder)
		{
			builder.RegisterType<LoginPageViewModel>()
				.As<ILoginPageViewModel>();
		}

		private void WireServices(ContainerBuilder builder)
		{
			builder.RegisterType<TokenManager>()
				.As<ITokenManager>()
				.SingleInstance();
		}

		private void WireLanguage(ContainerBuilder builder)
		{
			builder.Register(context =>
			{
				var languageManager = new LanguageManager();
				languageManager.AddTranslation(new EnglishTranslation());
				languageManager.AddTranslation(new GermanTranslation());

				return languageManager.GetCurrentTranslation();
			});
		}

		private void WirePages(ContainerBuilder builder)
		{
			builder.RegisterType<LoginPage>();
			builder.RegisterType<MainPage>();
		}

		public LoginPage LoginPage
		{
			get { return _container.Resolve<LoginPage>(); }
		}

		public MainPage MainPage
		{
			get { return _container.Resolve<MainPage>(); }
		}

		protected abstract void WirePlatformDependentServices(ContainerBuilder builder);
	}
}