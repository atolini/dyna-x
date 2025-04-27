[**kernel**](../../../../../README.md)

***

[kernel](../../../../../modules.md) / [services/email/implementations/ses](../README.md) / SESEmailService

# Class: SESEmailService

Defined in: [src/services/email/implementations/ses/index.ts:7](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/email/implementations/ses/index.ts#L7)

AWS SES implementation of IEmailService.

## Implements

- [`IEmailService`](../../../contracts/interfaces/IEmailService.md)

## Constructors

### Constructor

> **new SESEmailService**(`defaultSender`, `region?`): `SESEmailService`

Defined in: [src/services/email/implementations/ses/index.ts:11](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/email/implementations/ses/index.ts#L11)

#### Parameters

##### defaultSender

`string`

##### region?

`string`

#### Returns

`SESEmailService`

## Methods

### sendEmail()

> **sendEmail**(`message`): `Promise`\<`void`\>

Defined in: [src/services/email/implementations/ses/index.ts:16](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/email/implementations/ses/index.ts#L16)

Sends an email.

#### Parameters

##### message

[`EmailMessage`](../../../contracts/interfaces/EmailMessage.md)

The message to be sent.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEmailService`](../../../contracts/interfaces/IEmailService.md).[`sendEmail`](../../../contracts/interfaces/IEmailService.md#sendemail)
