import {
    NotFoundException,
  } from '@nestjs/common';
  import { Test, TestingModule } from '@nestjs/testing';
  import { CustomersController } from './customers.controller';
  import { CustomersService } from './customers.service';
  import { CreateCustomerDto } from './dto/create-customer.dto';


  class MockResponse {
    res: any;
    constructor() {
      this.res = {};
    }
    status = jest
      .fn()
      .mockReturnThis()
      .mockImplementationOnce((code) => {
        this.res.code = code;
        return this;
      });
    send = jest
      .fn()
      .mockReturnThis()
      .mockImplementationOnce((message) => {
        this.res.message = message;
        return this;
      });
    json = jest
      .fn()
      .mockReturnThis()
      .mockImplementationOnce((json) => {
        this.res.json = json;
        return this;
      });
  }

  const mockCustomer: any = {
    privateKey: '0xf1a1bdc74c14c26dc8b07edc5e932b417deb5fc74cff51968c2fbbfcd6476253',
    clientId: '2',
    address: '0xabEd38828047C5527EC6605107d4B820afaF611d',
  };

  const createCustomerDto: CreateCustomerDto = {
    privateKey: '0xf1a1bdc74c14c26dc8b07edc5e932b417deb5fc74cff51968c2fbbfcd6476253',
    clientId: '2',
    address: '0xabEd38828047C5527EC6605107d4B820afaF611d',
  };

  const auth = "666777888999"

  describe('Customers Controller', () => {
    let customersController: CustomersController;
    let customersService: CustomersService;

    const response = new MockResponse();

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [CustomersController],
        providers: [
          {
            provide: CustomersService,
            useValue: {
              create: jest.fn(() => []),
              findOne: jest.fn(() => {}),
            },
          },
        ],
      }).compile();

      customersController = module.get<CustomersController>(CustomersController);
      customersService = module.get<CustomersService>(CustomersService);
    });

    it('should be defined', () => {
      expect(customersController).toBeDefined();
    });

    describe('getCustomer()', () => {
      it('should call method findOne in CustomersService with correct value', async () => {
        const findSpy = jest.spyOn(customersService, 'findOne');
        await customersController.getCustomer(response, 'anyid', auth);
        expect(findSpy).toHaveBeenCalledWith('anyid');
      });

      it('should throw if CustomersService findOne throws', async () => {
        jest
          .spyOn(customersService, 'findOne')
          .mockRejectedValueOnce(new NotFoundException());
        await expect(
          customersController.getCustomer(response, 'anyid', auth),
        ).rejects.toThrow(new NotFoundException());
      });

      it('should return a customer on success', async () => {
        jest
          .spyOn(customersService, 'findOne')
          .mockResolvedValueOnce(mockCustomer);
        await customersController.getCustomer(response, 'anyid', auth);
        expect(customersService.findOne).toHaveBeenCalled();
      });
    });

    describe('addCustomer()', () => {
      it('should call method create in CustomersService with correct values', async () => {
        const createSpy = jest.spyOn(customersService, 'create');
        await customersController.addWallet(response, createCustomerDto, auth);
        expect(createSpy).toHaveBeenCalledWith(createCustomerDto);
      });

      it('should return a customer on success', async () => {
        const createCustomerSpy = jest.spyOn(customersService, 'create');
        await customersController.addWallet(response, createCustomerDto, auth);
        expect(createCustomerSpy).toHaveBeenCalledWith(createCustomerDto);
      });
    });

  });