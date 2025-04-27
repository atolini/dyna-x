[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/email/contracts](../README.md) / IEmailService

# Interface: IEmailService

Defined in: [src/services/email/contracts/index.ts:9](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/email/contracts/index.ts#L9)

## Methods

### sendEmail()

> **sendEmail**(`message`): `Promise`\<`void`\>

Defined in: [src/services/email/contracts/index.ts:14](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/email/contracts/index.ts#L14)

Sends an email.

#### Parameters

##### message

[`EmailMessage`](EmailMessage.md)

The message to be sent.

#### Returns

`Promise`\<`void`\>
